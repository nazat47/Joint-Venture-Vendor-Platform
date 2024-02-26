import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Activation,
  AdminDashboardEventsPage,
  AdminDashboardOrdersPage,
  AdminDashboardPage,
  AdminDashboardProductsPage,
  AdminDashboardShopsPage,
  AdminDashboardUsersPage,
  AdminDashboardWithdrawPage,
  BestSelling,
  CheckoutPage,
  CreateShop,
  Events,
  FAQ,
  Home,
  LoginPage,
  OrderDetailsPage,
  OrderSuccessPage,
  PaymentPage,
  ProductDetailsPage,
  Products,
  ProfilePage,
  ShopActivation,
  ShopAllCouponsPage,
  ShopAllEventsPage,
  ShopAllOrders,
  ShopAllRefunds,
  ShopCreateEventsPage,
  ShopCreateProduct,
  ShopDashboardPage,
  ShopHomePage,
  ShopInboxPage,
  ShopLoginPage,
  ShopOrderDetails,
  ShopPreviewPage,
  ShopSettingsPage,
  ShopWithdrawPage,
  SignupPage,
  TrackOrderPage,
  UserInboxPage,
} from "./routes/Routes";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Protected } from "./protectedRoutes/Protected";
import { SellerProtected } from "./protectedRoutes/SellerProtected";
import ShopAllProducts from "./pages/shop/ShopAllProducts";
import { useEffect, useState } from "react";
import { AdminProtected } from "./protectedRoutes/AdminProtected";

function App() {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [stripeApiKey, setStripeApiKey] = useState("");

  const getStripeApiKey = async () => {
    try {
      const { data } = await axios.get(
        `${REACT_APP_BASE_URL}/payment/getstripeapikey`
      );
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.log(error.message)
    }
   
  };
  useEffect(() => {
    getStripeApiKey();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Routes>
              <Route
                path="/payment"
                element={
                  <Protected>
                    <PaymentPage />
                  </Protected>
                }
              />
            </Routes>
          </Elements>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/activation/:token" element={<Activation />} />
          <Route
            path="/seller/activation/:token"
            element={<ShopActivation />}
          />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSelling />} />
          <Route path="/events" element={<Events />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/checkout"
            element={
              <Protected>
                <CheckoutPage />
              </Protected>
            }
          />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            path="/inbox"
            element={
              <Protected>
                <UserInboxPage />
              </Protected>
            }
          />
          <Route
            path="/user/order/:id"
            element={
              <Protected>
                <OrderDetailsPage />
              </Protected>
            }
          />
          <Route
            path="/user/track/order/:id"
            element={
              <Protected>
                <TrackOrderPage />
              </Protected>
            }
          />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/login-shop" element={<ShopLoginPage />} />
          <Route
            path="/shop/:id"
            element={
              <SellerProtected>
                <ShopHomePage />
              </SellerProtected>
            }
          />
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          <Route
            path="/settings"
            element={
              <SellerProtected>
                <ShopSettingsPage />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-withdraw"
            element={
              <SellerProtected>
                <ShopWithdrawPage />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SellerProtected>
                <ShopDashboardPage />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-create-products"
            element={
              <SellerProtected>
                <ShopCreateProduct />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-messages"
            element={
              <SellerProtected>
                <ShopInboxPage />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-products"
            element={
              <SellerProtected>
                <ShopAllProducts />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-refunds"
            element={
              <SellerProtected>
                <ShopAllRefunds />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-orders"
            element={
              <SellerProtected>
                <ShopAllOrders />
              </SellerProtected>
            }
          />
          <Route
            path="/order/:id"
            element={
              <SellerProtected>
                <ShopOrderDetails />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-create-event"
            element={
              <SellerProtected>
                <ShopCreateEventsPage />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-events"
            element={
              <SellerProtected>
                <ShopAllEventsPage />
              </SellerProtected>
            }
          />
          <Route
            path="/dashboard-coupons"
            element={
              <SellerProtected>
                <ShopAllCouponsPage />
              </SellerProtected>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtected>
                <AdminDashboardPage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/dashboard-users"
            element={
              <AdminProtected>
                <AdminDashboardUsersPage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/dashboard-sellers"
            element={
              <AdminProtected>
                <AdminDashboardShopsPage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/dashboard-orders"
            element={
              <AdminProtected>
                <AdminDashboardOrdersPage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/dashboard-products"
            element={
              <AdminProtected>
                <AdminDashboardProductsPage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/dashboard-events"
            element={
              <AdminProtected>
                <AdminDashboardEventsPage />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/dashboard-withdraw"
            element={
              <AdminProtected>
                <AdminDashboardWithdrawPage />
              </AdminProtected>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
