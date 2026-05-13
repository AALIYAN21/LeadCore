import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  CheckCircle2,
  Users,
  Target,
  MessageSquare,
  Sparkles as SparkleIcon,
  BarChart3,
  Bot,
  Activity,
  DollarSign,
  Mail,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      custom={delay / 100}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUpVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function LandingPage() {
  const [aiStep, setAiStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAiStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const mockStats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      trend: "+20.1%",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Active Leads",
      value: "2,350",
      trend: "+180",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Conversion",
      value: "12.5%",
      trend: "+2.4%",
      icon: Target,
      color: "text-purple-500",
    },
    {
      title: "AI Actions",
      value: "342",
      trend: "Automated",
      icon: Brain,
      color: "text-primary",
    },
  ];

  const aiWorkflowSteps = [
    { text: "Analyzing latest lead data...", icon: Activity },
    { text: "Identifying high-intent signals...", icon: Target },
    { text: "Drafting personalized email...", icon: Brain },
    { text: "Ready to review: Acme Corp", icon: Bot },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/20">
        {/* Navbar */}
        <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-border/50 bg-background/70 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:px-6"
          >
            <div className="flex items-center gap-3 font-bold tracking-tight">
              <img
                src="/favicon.png"
                alt="LeadCore"
                className="h-9 w-9 rounded-xl ring-1 ring-border"
              />

              <div className="hidden sm:block">
                <div className="text-lg font-black">LeadCore</div>
                <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                  AI Enabled CRM
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
              <a href="#features" className="transition hover:text-foreground">
                Features
              </a>

              <a href="#about" className="transition hover:text-foreground">
                About
              </a>

              <a href="#pricing" className="transition hover:text-foreground">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                to="/login"
                className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] hover:bg-primary/90"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </nav>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6 md:pb-32 md:pt-44">
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[-120px] top-40 h-[350px] w-[350px] rounded-full bg-primary/10 blur-3xl"
          />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />

          {/* Background Gradients */}
          <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] -z-10 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px] -z-10 animate-pulse delay-1000" />

          <div className="mx-auto max-w-6xl">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <Reveal>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-4 font-medium">
                  {/* <SparkleIcon className="mr-2 h-4 w-4 animate-pulse" /> */}
                  AI-Powered Sales CRM
                </div>
                <h1 className="mb-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                  Close more deals with <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-500">
                    intelligent insights.
                  </span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                  LeadCore is the next-generation sales assistant for
                  freelancers and agencies. Track leads, automate follow-ups,
                  and leverage AI workflows to write perfect messages.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
                  >
                    Start for free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <a
                    href="#features"
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-base font-medium hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    Learn more
                  </a>
                </div>
              </Reveal>
            </div>

            {/* 3D Dashboard Mockup */}
            <Reveal
              delay={200}
              className="relative mx-auto max-w-6xl [perspective:2000px]"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
              </div>

              <motion.div
                initial={{ rotateX: 18, y: 80, opacity: 0, scale: 0.92 }}
                whileInView={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  rotateX: 2,
                  rotateY: -2,
                  transition: { duration: 0.4 },
                }}
                className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 rounded-[2rem] p-[1px]">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-primary/30 via-white/10 to-primary/30 opacity-60 blur-xl" />
                </div>

                {/* Top Bar */}
                <div className="relative flex items-center gap-3 border-b border-border/50 bg-background/40 px-5 py-4 backdrop-blur-xl">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/40" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/40" />
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/40" />
                  </div>

                  <div className="mx-auto flex h-8 w-72 items-center justify-center rounded-full border border-border/50 bg-background/50 px-4 text-xs text-muted-foreground backdrop-blur">
                    https://leadcore.app/dashboard
                  </div>
                </div>

                <div className="flex min-h-[420px] flex-col lg:h-[680px] lg:flex-row">
                  {/* Sidebar */}
                  <div className="hidden w-64 shrink-0 border-r border-border/50 bg-muted/20 p-5 backdrop-blur-xl lg:block">
                    <div className="mb-8 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-primary/20 ring-1 ring-primary/30" />
                      <div>
                        <div className="h-3 w-20 rounded bg-foreground/20" />
                        <div className="mt-2 h-2 w-12 rounded bg-foreground/10" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`flex h-11 items-center rounded-xl px-4 ${
                            i === 1
                              ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                              : "bg-transparent"
                          }`}
                        >
                          <div className="h-3 w-24 rounded bg-current/30" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="relative flex-1 overflow-hidden p-4 sm:p-6 md:p-8">
                    {/* Background Grid */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Header */}
                    <div className="relative mb-8 flex items-center justify-between">
                      <div>
                        <div className="h-7 w-40 rounded-lg bg-foreground/10" />
                        <div className="mt-3 h-3 w-24 rounded bg-foreground/5" />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-32 rounded-xl border border-border/50 bg-background/50 backdrop-blur" />
                        <div className="h-10 w-10 rounded-full bg-primary/20 ring-1 ring-primary/20" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {mockStats.map((stat, i) => {
                        const Icon = stat.icon;

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4 + i * 0.08,
                              duration: 0.7,
                              type: "spring",
                            }}
                            whileHover={{
                              y: -4,
                              scale: 1.015,
                            }}
                            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-5 shadow-lg backdrop-blur-xl"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                            <div className="relative flex items-center justify-between">
                              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {stat.title}
                              </span>

                              <div className="rounded-xl bg-primary/10 p-2">
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                              </div>
                            </div>

                            <div className="relative mt-5">
                              <div className="text-3xl font-black tracking-tight">
                                {stat.value}
                              </div>

                              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                {stat.trend}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Main Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="relative mt-8 h-[300px] overflow-hidden rounded-3xl border border-border/50 bg-background/40 p-6 backdrop-blur-xl"
                    >
                      {/* Glow */}
                      <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

                      {/* Fake Chart */}
                      <svg
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 100"
                      >
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="var(--color-primary)"
                              stopOpacity="0.5"
                            />
                            <stop
                              offset="100%"
                              stopColor="var(--color-primary)"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>

                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 2,
                            ease: "easeInOut",
                            delay: 1,
                          }}
                          d="M0,85 C10,70 20,90 30,60 C40,35 50,55 60,40 C70,20 80,25 100,5"
                          fill="none"
                          stroke="var(--color-primary)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        <motion.path
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3 }}
                          d="M0,85 C10,70 20,90 30,60 C40,35 50,55 60,40 C70,20 80,25 100,5 L100,100 L0,100 Z"
                          fill="url(#chartGradient)"
                        />
                      </svg>

                      {/* Chart Overlay Cards */}
                      <div className="relative z-10 flex h-full items-end justify-between">
                        {[65, 40, 90, 55, 75].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{
                              delay: 1.2 + i * 0.1,
                              duration: 0.8,
                            }}
                            className="w-10 rounded-t-full bg-primary/20 backdrop-blur"
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Floating AI Agent */}
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 1.5,
                        type: "spring",
                        stiffness: 120,
                      }}
                      whileHover={{
                        scale: 1.03,
                      }}
                      className="absolute bottom-4 left-4 right-4 flex items-center gap-4 rounded-3xl border border-primary/20 bg-card/90 p-4 shadow-2xl backdrop-blur-2xl sm:bottom-8 sm:left-auto sm:right-8 sm:w-auto sm:p-5"
                    >
                      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />

                        <div
                          className="absolute inset-0 animate-ping rounded-2xl border border-primary/30"
                          style={{ animationDuration: "3s" }}
                        />

                        {(() => {
                          const CurrentIcon = aiWorkflowSteps[aiStep].icon;

                          return (
                            <CurrentIcon className="relative z-10 h-6 w-6" />
                          );
                        })()}
                      </div>

                      <div className="min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">AI Agent Active</p>

                          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <motion.p
                          key={aiStep}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs leading-relaxed text-muted-foreground"
                        >
                          {aiWorkflowSteps[aiStep].text}
                        </motion.p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </section>
        <InfiniteMarquee />
        {/* Features */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">
                Everything you need to sell.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools designed to keep your pipeline moving forward
                without the clutter of traditional CRMs.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Brain}
                title="AI Assistant"
                description="Bring your own Gemini API key to draft personalized emails and analyze lead sentiments instantly."
                delay={100}
              />
              <FeatureCard
                icon={TrendingUp}
                title="Pipeline Tracking"
                description="Visual kanban boards and list views to track exactly where every deal stands."
                delay={200}
              />
              <FeatureCard
                icon={Zap}
                title="Smart Reminders"
                description="Never miss a follow-up. Get automated alerts for leads that need your attention."
                delay={300}
              />
            </div>
          </div>
        </section>
        {/* About Us / Open Source */}
        <section id="about" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-top-left -z-10" />
          <div className="mx-auto max-w-6xl px-6 text-center">
            <Reveal>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
                Built for modern <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  sales teams.
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12">
                We believe CRMs shouldn't be bloated, slow, or expensive.
                LeadCore is built on a modern stack to be lightning-fast, highly
                secure, and completely transparent.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-8 text-left mt-16 max-w-4xl mx-auto">
              <Reveal
                delay={100}
                className="p-8 rounded-3xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To democratize sales technology by offering an
                  enterprise-grade AI CRM to everyone, at zero cost. We want to
                  empower freelancers and small agencies worldwide.
                </p>
              </Reveal>
              <Reveal
                delay={200}
                className="p-8 rounded-3xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <Shield className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your data is yours. With our Bring Your Own Key (BYOK)
                  architecture, your AI interactions remain strictly between you
                  and your provider.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
        {/* Pricing */}
        <section id="pricing" className="py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Reveal>
              <h2 className="text-5xl font-extrabold tracking-tight md:text-7xl mb-6">
                Open Source.
                <br />
                <span className="text-muted-foreground">Always free.</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-16">
                We believe great tools should be accessible to everyone.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mx-auto max-w-md rounded-[2.5rem] border border-border bg-card p-12 text-left shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 h-48 w-48 bg-primary/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700" />
                <div className="relative z-10">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
                    Community Edition
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-7xl font-black">$0</span>
                    <span className="text-xl text-muted-foreground font-medium">
                      /forever
                    </span>
                  </div>

                  <ul className="mt-8 space-y-4 text-sm text-muted-foreground">
                    {[
                      "Unlimited Leads & Deals",
                      "AI Assistant (BYOK)",
                      "Task & Reminder Tracking",
                      "Kanban & List Views",
                      "Dark Mode & Themes",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/signup"
                    className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-foreground text-background font-medium transition-transform hover:scale-105 hover:bg-foreground/90"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        {/* Footer */}
        <footer className="relative mx-3 mb-3 mt-24 overflow-hidden rounded-[2.5rem] border border-border bg-gradient-to-b from-background to-muted/30 sm:mx-4 sm:rounded-[3rem]">
          {/* Background Glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          {/* Infinite Marquee */}
          <div className="relative overflow-hidden border-b border-border/50 py-10">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{
                duration: 100,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex w-max whitespace-nowrap"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="mx-6 flex items-center gap-6 text-4xl font-black uppercase tracking-tight text-foreground/10 sm:text-6xl md:text-8xl"
                >
                  <span>LeadCore AI CRM</span>
                  <span className="text-primary/20">•</span>
                  <span>Smart Sales</span>
                  <span className="text-primary/20">•</span>
                  <span>Automation</span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-24">
            {/* MAIN GRID */}
            <div className="grid gap-16 lg:grid-cols-12">
              {/* BRAND */}
              <div className="lg:col-span-5">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                    <img
                      src="/favicon.png"
                      alt="LeadCore"
                      className="h-8 w-8 rounded-lg"
                    />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black tracking-tight">
                      LeadCore
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      AI-Powered CRM Platform
                    </p>
                  </div>
                </div>

                <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                  Transform the way your sales team operates with intelligent
                  lead management, real-time analytics, automation, and seamless
                  collaboration powered by AI.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:scale-[1.02] hover:bg-primary/90"
                  >
                    Start Free Trial
                  </a>

                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-accent"
                  >
                    Explore Features
                  </a>
                </div>
              </div>

              {/* SOCIALS */}
              <div className="lg:col-span-3">
                <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">
                  Socials
                </h4>

                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/aaliyan-ahmed-b7349030b/"
                      className="hover:text-primary"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      Twitter / X
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      Discord
                    </a>
                  </li>
                </ul>
              </div>

              {/* CONTACT + CREDITS (RIGHT SIDE STACKED - REBALANCED) */}
              <div className="lg:col-span-4 flex flex-col justify-start gap-12">
                {/* Contact */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Contact
                  </h4>

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>aaliyan@systemsthread.com</span>
                    </div>
                  </div>
                </div>

                {/* Credits (moved up + tighter layout) */}
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Built with modern SaaS architecture and precision design
                  </p>

                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    Made with <span className="text-red-500">❤️</span> by{" "}
                    <a
                      href="https://www.systemsthread.com"
                      className="hover:text-primary"
                    >
                      SystemsThread
                    </a>
                    <img
                      src="https://flagcdn.com/w40/pk.png"
                      alt="Pakistan"
                      className="h-4 w-6 rounded-sm"
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
              <p>© {new Date().getFullYear()} LeadCore. All rights reserved.</p>

              <div className="flex flex-wrap items-center gap-6">
                <a href="#" className="hover:text-foreground">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-foreground">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-foreground">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}

function InfiniteMarquee() {
  const items = [
    "AI-Powered Insights",
    "Multi-Currency Support",
    "Smart Lead Tracking",
    "Automated Workflows",
    "Premium Analytics",
    "Customizable Themes",
    "Seamless Integrations",
    "Cloud Sync",
  ];

  return (
    <div className="relative overflow-hidden border-y border-border/50 bg-muted/20 py-10 sm:py-14">
      <div className="flex whitespace-nowrap gap-10 animate-marquee will-change-transform">
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-2xl font-bold text-muted-foreground/40 hover:text-primary/60 transition-colors cursor-default select-none"
          >
            <div className="h-2 w-2 rounded-full bg-primary/30" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: any) {
  return (
    <Reveal
      delay={delay}
      className="group relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Reveal>
  );
}
