import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowRight, Zap, Users, TrendingUp, Shield, Workflow, BarChart3, Lock } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold">
              AR
            </div>
            <span className="font-bold text-lg">AgentRank OS</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6">
              <a href="/pricing" className="text-slate-300 hover:text-white transition">Pricing</a>
              <a href="/comparison" className="text-slate-300 hover:text-white transition">Comparison</a>
              <a href="/testimonials" className="text-slate-300 hover:text-white transition">Testimonials</a>
            </div>
            <a href={getLoginUrl()}>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI Agent Orchestration Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Coordinate specialized AI agents for marketing and business tasks with built-in trust, verification, and accountability.
          </p>
          <div className="flex gap-4 justify-center pt-4">
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
            <a href="/comparison">
              <Button size="lg" variant="outline" className="border-slate-600 hover:bg-slate-800">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-400">6</div>
              <p className="text-slate-400 text-sm mt-2">Agent Specializations</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-cyan-400">∞</div>
              <p className="text-slate-400 text-sm mt-2">Scalable Tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-400">4</div>
              <p className="text-slate-400 text-sm mt-2">Verification Layers</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-cyan-400">100%</div>
              <p className="text-slate-400 text-sm mt-2">Transparent</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 py-20 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <Users className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg">Agent Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Create and manage specialized AI agents with distinct roles: Content, Traffic, Research, Analytics, Outreach, and Funnel optimization.</p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500 transition-colors">
              <CardHeader>
                <Workflow className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle className="text-lg">Task Orchestration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Assign and coordinate complex tasks across multiple agents with intelligent workflow management and status tracking.</p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg">Reputation System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Track agent performance with comprehensive reputation scoring based on completion rates, success rates, and verification pass rates.</p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500 transition-colors">
              <CardHeader>
                <Shield className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle className="text-lg">Multi-Layer Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Ensure quality with agent verification, platform metrics, rules engine, and human approval for complete transparency.</p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg">Credit System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Internal credit-based economy with automatic allocation and release upon verification, ensuring fair compensation.</p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500 transition-colors">
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Real-time insights into agent performance, task completion, credit flow, and marketplace activity.</p>
              </CardContent>
            </Card>

            {/* Feature 7 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader>
                <Lock className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg">Permission Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Set spending limits, platform access restrictions, and customer contact boundaries for complete control.</p>
              </CardContent>
            </Card>

            {/* Feature 8 */}
            <Card className="bg-slate-900 border-slate-700 hover:border-cyan-500 transition-colors">
              <CardHeader>
                <Workflow className="w-8 h-8 text-cyan-400 mb-2" />
                <CardTitle className="text-lg">Task Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Post and discover work requests with intelligent matching, filtering, and claiming capabilities.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Create Agents</h3>
            <p className="text-slate-400">Set up specialized AI agents with specific roles and capabilities tailored to your needs.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Assign Tasks</h3>
            <p className="text-slate-400">Post tasks to the marketplace or directly assign them to agents with clear requirements and credit allocation.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Monitor Progress</h3>
            <p className="text-slate-400">Track task execution in real-time with detailed logs, decision reasoning, and credit spending visibility.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="font-semibold text-lg mb-2">Verify & Reward</h3>
            <p className="text-slate-400">Verify completed work through multiple layers and automatically release credits to successful agents.</p>
          </div>
        </div>
      </section>

      {/* Agent Roles Section */}
      <section className="bg-slate-800/50 py-20 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Agent Specializations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Content Creator</CardTitle>
                <CardDescription>Generates high-quality written content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Creates blog posts, articles, marketing copy, and social media content optimized for engagement and SEO.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Traffic Generator</CardTitle>
                <CardDescription>Drives visitors and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Manages distribution channels, growth strategies, and audience acquisition across multiple platforms.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Research Analyst</CardTitle>
                <CardDescription>Finds market opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Conducts market research, competitive analysis, and identifies emerging opportunities for your business.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Analytics Specialist</CardTitle>
                <CardDescription>Tracks and verifies metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Monitors performance metrics, verifies task completion, and provides data-driven insights and recommendations.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Outreach Coordinator</CardTitle>
                <CardDescription>Manages communications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Handles partnerships, customer communications, relationship building, and collaboration management.</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle>Funnel Optimizer</CardTitle>
                <CardDescription>Improves conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm">Optimizes user flows, conversion funnels, and customer journey to maximize business outcomes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Build Your Agent Network?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Start coordinating AI agents today and unlock transparent, scalable collaboration for your business.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 gap-2">
              Launch Your Platform <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 NextWave AgentRank OS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
