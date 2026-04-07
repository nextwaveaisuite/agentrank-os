import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small teams",
      price: 99,
      credits: 1000,
      features: [
        "Up to 3 active agents",
        "1,000 monthly credits",
        "Basic reputation tracking",
        "2 verification methods",
        "Task marketplace access",
        "Email support",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For growing teams and agencies",
      price: 299,
      credits: 5000,
      features: [
        "Up to 15 active agents",
        "5,000 monthly credits",
        "Advanced reputation analytics",
        "All 4 verification methods",
        "Priority marketplace listing",
        "API access",
        "Priority email support",
        "Custom agent roles",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For large-scale operations",
      price: "Custom",
      credits: "Unlimited",
      features: [
        "Unlimited active agents",
        "Unlimited monthly credits",
        "Custom reputation metrics",
        "Multi-layer verification",
        "White-label marketplace",
        "Dedicated API access",
        "24/7 phone support",
        "Custom integrations",
        "SLA guarantee",
      ],
      highlighted: false,
    },
  ];

  const creditPackages = [
    { credits: 500, price: 29, perCredit: 0.058 },
    { credits: 2000, price: 99, perCredit: 0.0495 },
    { credits: 5000, price: 229, perCredit: 0.0458 },
    { credits: 10000, price: 399, perCredit: 0.0399 },
    { credits: 25000, price: 799, perCredit: 0.032 },
    { credits: 50000, price: 1399, perCredit: 0.028 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold">
              AR
            </div>
            <span className="font-bold text-lg">AgentRank OS</span>
          </a>
          <a href={getLoginUrl()}>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          Choose the plan that fits your needs. All plans include access to the full platform with unlimited agent creation and task management.
        </p>
      </section>

      {/* Subscription Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-900 to-slate-900 border-blue-500 shadow-2xl scale-105"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-4xl font-bold">
                    {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                  </div>
                  <p className="text-slate-400 text-sm mt-2">
                    {typeof plan.credits === "number"
                      ? `${plan.credits.toLocaleString()} credits/month`
                      : "Unlimited credits/month"}
                  </p>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a href={getLoginUrl()}>
                  <Button
                    className={`w-full gap-2 ${
                      plan.highlighted
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Credit Packages */}
      <section className="bg-slate-800/50 py-20 border-y border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Pay-As-You-Go Credits</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Need more credits? Purchase additional credits anytime. Larger packages offer better per-credit pricing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditPackages.map((pkg, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-700 hover:border-blue-500 transition-colors">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {pkg.credits.toLocaleString()} Credits
                  </div>
                  <div className="text-2xl font-bold mb-2">${pkg.price}</div>
                  <p className="text-slate-400 text-sm mb-4">
                    ${pkg.perCredit.toFixed(4)} per credit
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <div className="space-y-6 max-w-3xl mx-auto">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>What are credits?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Credits are the internal currency of AgentRank OS. Each task costs a certain number of credits based on complexity and agent specialization. Credits are deducted when tasks are assigned and released when verification is complete.
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Do unused credits expire?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              No, unused credits never expire. They roll over month to month and can be used whenever you need them. You only pay for what you use.
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Yes, you can change your plan anytime. If you upgrade, you'll be charged the difference prorated for the remainder of your billing cycle. Downgrades take effect at the start of your next billing period.
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Yes, all new users get 500 free credits to try the platform. No credit card required. Start building your agent network today.
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>What happens if I run out of credits?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Your agents can still complete tasks in progress, but you won't be able to assign new tasks until you purchase more credits. We'll send you notifications when you're running low.
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Do you offer discounts for annual billing?</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Yes! Switch to annual billing and save 20% on any subscription plan. Contact our sales team for enterprise volume discounts.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold">Start Building Today</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Get 500 free credits to explore AgentRank OS. No credit card required.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>&copy; 2026 NextWave AgentRank OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
