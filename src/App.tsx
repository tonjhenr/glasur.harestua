import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ProductsPage } from "./components/ProductsPage";
import { AdminPage } from "./components/AdminPage";
import { LoginPage } from "./components/LoginPage";
import {
  CustomerAccountPage,
  CustomerData,
  Order,
} from "./components/CustomerAccountPage";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { supabase, mapNyhetFromDB, NyheterDB, mapProductFromDB, ProdukterDB, Product } from './assets/supabase-client';
import { projectId, publicAnonKey } from './assets/info';


export type NewsItem = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image?: string;
};

export type { Product } from './assets/supabase-client';

export type CartItem = {
  product: Product;
  quantity: number;
  variant?: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "products" | "admin" | "login" | "customer-account"
  >("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

   // Fetch news from Supabase on component mount
  useEffect(() => {
    fetchNews();
    fetchProducts();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("nyheter")
        .select("*");

      if (error) {
        console.error(
          "Supabase error ved henting av nyheter:",
          error,
        );
        return;
      }

      if (data) {
        // Map database format to app format
        const mappedNews = data.map((item: NyheterDB) =>
          mapNyhetFromDB(item),
        );
        setNews(mappedNews);
      }
    } catch (error) {
      console.error("Feil ved henting av nyheter:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c190d631/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error fetching products from server:",
          errorData,
        );
        return;
      }

      const data = await response.json();
      if (data.products) {
        // Map database format to app format
        const mappedProducts = data.products.map(
          (item: any) => {
            const productData = item as ProdukterDB;
            const types = item.types || [];
            return mapProductFromDB(productData, types);
          },
        );
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error("Feil ved henting av produkter:", error);
    }
  };

  const handleLogin = (
    username: string,
    password: string,
    isAdminLogin: boolean,
  ): boolean => {
    if (isAdminLogin) {
      // Admin login
      if (username === "admin" && password === "admin123") {
        setIsAdminLoggedIn(true);
        localStorage.setItem("isAdminLoggedIn", "true");
        setCurrentPage("admin");
        return true;
      }
    } else {
      // Customer login
      const customer = customerData;
      if (
        customer &&
        customer.email === username &&
        customer.password === password
      ) {
        setCustomerData(customer);
        localStorage.setItem(
          "customerData",
          JSON.stringify(customer),
        );
        setCurrentPage("customer-account");
        return true;
      }
    }
    return false;
  };

  const handleRegister = (
    email: string,
    password: string,
    name: string,
  ): boolean => {
    // Check if email already exists
    if (customerData && customerData.email === email) {
      return false;
    }

    // Create new customer
    const newCustomer: CustomerData = {
      id: Date.now().toString(),
      name,
      email,
      phone: "",
      address: "",
      password,
    };

    setCustomerData(newCustomer);
    localStorage.setItem(
      "customerData",
      JSON.stringify(newCustomer),
    );
    return true;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCustomerData(null);
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("customerData");
    setCurrentPage("home");
  };

  const handleUpdateProfile = (data: Partial<CustomerData>) => {
    if (!customerData) return;

    setCustomerData({
      ...customerData,
      ...data,
    });
    localStorage.setItem(
      "customerData",
      JSON.stringify({
        ...customerData,
        ...data,
      }),
    );
  };

  const handleChangePassword = (
    oldPassword: string,
    newPassword: string,
  ): boolean => {
    if (!customerData) return false;

    const customer = customerData;
    if (!customer || customer.password !== oldPassword) {
      return false;
    }

    setCustomerData({
      ...customer,
      password: newPassword,
    });
    localStorage.setItem(
      "customerData",
      JSON.stringify({
        ...customer,
        password: newPassword,
      }),
    );
    return true;
  };

  const addToCart = (product: Product, variant?: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.product.id === product.id &&
          item.variant === variant,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id &&
          item.variant === variant
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, quantity: 1, variant }];
    });
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    variant?: string,
  ) => {
    if (quantity <= 0) {
      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            item.product.id !== productId ||
            item.variant !== variant,
        ),
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId &&
          item.variant === variant
            ? { ...item, quantity }
            : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        cartItemCount={cart.reduce(
          (sum, item) => sum + item.quantity,
          0,
        )}
        isAdmin={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentPage === "home" && <HomePage news={news} />}
        {currentPage === "products" && (
          <ProductsPage
            products={products}
            cart={cart}
            onAddToCart={addToCart}
            onUpdateCartQuantity={updateCartQuantity}
            onClearCart={clearCart}
          />
        )}
        {currentPage === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}
        {currentPage === "customer-account" && customerData && (
          <CustomerAccountPage
            customerData={customerData}
            orders={orders}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
          />
        )}
        {currentPage === "admin" &&
          (isAdminLoggedIn ? (
            <AdminPage
              products={products}
              news={news}
              onUpdateProducts={setProducts}
              onUpdateNews={setNews}
            />
          ) : (
            <LoginPage
              onLogin={handleLogin}
              onRegister={handleRegister}
              adminOnly
            />
          ))}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}