import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { NicheProvider } from "@/contexts/NicheContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ProblemPage from "./pages/ProblemPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ForumPage from "./pages/ForumPage";
import NewQuestionPage from "./pages/NewQuestionPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProblems from "./pages/admin/AdminProblems";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProblemForm from "./pages/admin/AdminProblemForm";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import InstallPage from "./pages/InstallPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NicheProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPage />} />
            <Route path="/entrar" element={<AuthPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/instalar" element={<InstallPage />} />
            
            {/* Forum Routes */}
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/nova-pergunta" element={<NewQuestionPage />} />
            <Route path="/forum/:questionId" element={<QuestionDetailPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/problemas" element={<AdminProblems />} />
            <Route path="/admin/problemas/novo" element={<AdminProblemForm />} />
            <Route path="/admin/problemas/:problemId" element={<AdminProblemForm />} />
            <Route path="/admin/categorias" element={<AdminCategories />} />
            
            {/* Dynamic Routes - Must be last */}
            <Route path="/:categorySlug" element={<CategoryPage />} />
            <Route path="/:categorySlug/:problemSlug" element={<ProblemPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </NicheProvider>
  </QueryClientProvider>
);

export default App;
