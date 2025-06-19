// // App.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import LoginPage from "./pages/LoginPage.jsx";
// import Register from "./pages/Register.jsx";
// import ForgotPassword from "./pages/ForgotPassword.jsx";
// import ResetPassword from "./pages/ResetPassword.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
// import NotFound from "./pages/NotFound.jsx";
// import Unauthorized from "./pages/Unauthorized.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import JournalUpload from './components/JournalUpload.jsx';
// import JournalList from './components/JournalList.jsx';
// import JournalDetail from './components/JournalDetail.jsx';
// import Home from "./pages/Home.jsx";
// import ManageJournal from "./pages/ManageJournal.jsx";
// import LogoutPage from "./pages/LogoutPage.jsx";
// import JournalArchive from "./pages/JournalArchive.jsx";
// import JournalSubmission from "./components/JournalSubmission.jsx";
// import Navigation from "./components/Navigation.jsx";
// import About from "./components/About.jsx";
// import Guide from "./components/Guide.jsx";
// import Contact from "./components/Contact.jsx";
// import Footer from "./components/Footer.jsx";
// import Sidebar from "./components/Sidebar.jsx";
// import TestComponent from "./components/TestComponent.jsx";

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const storedUser = localStorage.getItem('authUser');
//   const user = storedUser ? JSON.parse(storedUser) : null;
  
//   // Debug user information
//   console.log('App.jsx - Stored User:', storedUser);
//   console.log('App.jsx - Parsed User:', user);

//   const checkMobile = () => {
//     setIsMobile(window.innerWidth <= 768);
//   };

//   useEffect(() => {
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const toggleSidebar = () => setSidebarOpen(prev => !prev);

//   return (
//     <Router>
//       <div className="min-h-screen bg-slate-900 text-gray-100 flex">
//         {/* Sidebar - Fixed position only on larger screens */}
//         <div className={`${isMobile ? 'fixed' : 'sticky'} top-0 h-screen z-40 ${
//             isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : ""
//           } transition-transform duration-300`}
//           style={{ width: '16rem', minWidth: '16rem' }}
//         >
//           <Sidebar
//             className={`h-full w-64 ${!isMobile || sidebarOpen ? "block" : "hidden"}`}
//             onClose={() => setSidebarOpen(false)}
//           />
//         </div>

//         {/* Mobile Overlay */}
//         {isMobile && sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-30"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Main Layout - Take remaining width */}
//         <div className="flex flex-col min-h-screen flex-grow">
//           {/* Navigation */}
//           <div className="fixed top-0 right-0 left-0 z-50 
//               md:left-64" // On medium+ screens, leave space for sidebar
//           >
//             <Navigation user={user} toggleSidebar={toggleSidebar} />
//           </div>

//           {/* Page Content */}
//           <main className="flex-grow pt-24 bg-white text-black px-6 pb-12 rounded-t-lg shadow-inner">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/logout" element={<LogoutPage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/forgotpassword" element={<ForgotPassword />} />
//               <Route path="/resetpassword/:token" element={<ResetPassword />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/guide" element={<Guide />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="/journals" element={<JournalList />} />
//               <Route path="/journals/:id" element={<JournalDetail />} />
//               <Route path="/archive" element={<JournalArchive />} />
//               <Route path="/unauthorized" element={<Unauthorized />} />
//               <Route path="/test" element={<TestComponent />} />

//               {/* Protected */}
//               <Route path="/dashboard" element={
//                 <ProtectedRoute allowedRoles={["admin", "author", "user"]}>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }/>
//               <Route path="/updateprofile" element={
//                 <ProtectedRoute allowedRoles={["admin", "author", "user"]}>
//                   <UpdateProfilePage />
//                 </ProtectedRoute>
//               }/>
//               <Route path="/submission" element={
//                 <ProtectedRoute allowedRoles={["admin", "author", "user"]}>
//                   <JournalSubmission />
//                 </ProtectedRoute>
//               }/>

//               {/* Admin Only */}
//               <Route path="/journals/uploads" element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <JournalUpload />
//                 </ProtectedRoute>
//               }/>
//               <Route path="/manage-journals" element={
//                 <ProtectedRoute allowedRoles={["admin"]}>
//                   <ManageJournal />
//                 </ProtectedRoute>
//               }/>

//               <Route path="*" element={<NotFound />} />
//             </Routes>

//             {/* Footer */}
//             <Footer />
//           </main>
//         </div>

//         {/* Toast Notifications */}
//         <ToastContainer
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </div>
//     </Router>
//   );
// }

// export default App;

// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import JournalUpload from './components/JournalUpload.jsx';
import JournalList from './components/JournalList.jsx';
import JournalDetail from './components/JournalDetail.jsx';
import Home from "./pages/Home.jsx";
import ManageJournal from "./pages/ManageJournal.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";
import JournalArchive from "./pages/JournalArchive.jsx";
import JournalSubmission from "./components/JournalSubmission.jsx";
import Navigation from "./components/Navigation.jsx";
import About from "./components/About.jsx";
import Guide from "./components/Guide.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import TestComponent from "./components/TestComponent.jsx";

function App() {
  const storedUser = localStorage.getItem('authUser');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col">
        {/* Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navigation user={user} />
        </div>

        {/* Main Content */}
        <main className="flex-grow pt-24 bg-white text-black px-6 pb-12 rounded-t-lg shadow-inner">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/journals" element={<JournalList />} />
            <Route path="/journals/:id" element={<JournalDetail />} />
            <Route path="/archive" element={<JournalArchive />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/test" element={<TestComponent />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["admin", "author", "user"]}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/updateprofile" element={
              <ProtectedRoute allowedRoles={["admin", "author", "user"]}>
                <UpdateProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/submission" element={
              <ProtectedRoute allowedRoles={["admin", "author", "user"]}>
                <JournalSubmission />
              </ProtectedRoute>
            } />

            {/* Admin Only Routes */}
            <Route path="/journals/uploads" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <JournalUpload />
              </ProtectedRoute>
            } />
            <Route path="/manage-journals" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageJournal />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Footer */}
          <Footer />
        </main>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
