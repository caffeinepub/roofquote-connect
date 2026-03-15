import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Facebook,
  FileText,
  Home,
  Loader2,
  MapPin,
  Phone,
  Shield,
  Star,
  ThumbsUp,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { JobType, useSubmitLead } from "../hooks/useQueries";

const PHONE_NUMBER = "07400 701164";
const PHONE_HREF = "tel:07400701164";

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {STAR_KEYS.slice(0, count).map((k) => (
        <Star key={k} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const STATS = [
  { number: "2,400+", label: "Quotes Matched This Year" },
  { number: "4.9 / 5", label: "Average Customer Rating" },
  { number: "92%", label: "Get a Response Same Day" },
  { number: "£350", label: "Average Saving vs Calling Direct" },
];

const ACCREDITATIONS = [
  { icon: "✅", label: "Fully Insured Contractors" },
  { icon: "🏆", label: "Which? Trusted Trader Network" },
  { icon: "🛡️", label: "Public Liability Cover" },
  { icon: "📋", label: "Free Written Quotes" },
  { icon: "🔧", label: "All Work Guaranteed" },
  { icon: "⏰", label: "24/7 Emergency Response" },
];

const TESTIMONIALS = [
  {
    name: "Gary P.",
    location: "Stretford, Manchester",
    rating: 5,
    text: "Had three ridge tiles blow off in the storm last month. Called two companies who never got back to me, then tried RoofQuote Connect. Had a local lad from Stretford ring me back within the hour. Job done the next morning for £180. Can't complain.",
  },
  {
    name: "Diane H.",
    location: "Didsbury, Manchester",
    rating: 5,
    text: "Our Edwardian terrace has original Welsh slate and I was worried nobody would touch it. RoofQuote matched us with a specialist who actually knew his stuff — repaired six broken slates and repointed the entire ridge for £420. Saved us a fortune compared to what the big firms quoted.",
  },
  {
    name: "Rob & Karen T.",
    location: "Chorlton, Manchester",
    rating: 5,
    text: "Full flat roof replacement on the back extension. Three quotes through RoofQuote Connect — all came out within a week, all professional. Went with the middle quote, £2,200, and the work was done in a single day. 10-year guarantee on the EPDM membrane. Chuffed to bits.",
  },
];

const TEAM = [
  {
    name: "Dave Morrish",
    role: "Lead Roofer — 18 Years Experience",
    area: "North Manchester",
  },
  {
    name: "Steve Baines",
    role: "Flat Roof Specialist — 12 Years Experience",
    area: "Salford & Eccles",
  },
  {
    name: "Andy Calvert",
    role: "Slate & Heritage Roofing — 22 Years Experience",
    area: "South Manchester",
  },
];

const GALLERY = [
  {
    src: "/assets/generated/completed-roof-1.dim_800x600.jpg",
    alt: "New slate roof on Victorian terrace, Manchester",
    label: "Slate Roof Replacement",
  },
  {
    src: "/assets/generated/completed-roof-2.dim_800x600.jpg",
    alt: "Flat roof extension replacement, Manchester",
    label: "Flat Roof Replacement",
  },
  {
    src: "/assets/generated/completed-roof-3.dim_800x600.jpg",
    alt: "Chimney repointing completed, Manchester",
    label: "Chimney Repointing",
  },
  {
    src: "/assets/generated/completed-roof-4.dim_800x600.jpg",
    alt: "Ridge tile replacement in progress",
    label: "Ridge Tile Replacement",
  },
  {
    src: "/assets/generated/roofer-closeup.dim_800x600.jpg",
    alt: "Roofer laying new slate tiles in Manchester",
    label: "Slate Tile Repair",
  },
  {
    src: "/assets/generated/roofer-working.dim_800x600.jpg",
    alt: "Professional roofer working on Manchester home",
    label: "Emergency Repair",
  },
];

const BEFORE_AFTERS = [
  {
    src: "/assets/generated/before-after-1.dim_1200x500.jpg",
    alt: "Slate roof before and after restoration",
    title: "Slate Roof Restoration",
    desc: "Full re-slate on a Manchester Victorian terrace",
  },
  {
    src: "/assets/generated/before-after-2.dim_1200x500.jpg",
    alt: "Flat roof before and after replacement",
    title: "Flat Roof Replacement",
    desc: "EPDM rubber membrane on rear extension",
  },
  {
    src: "/assets/generated/before-after-3.dim_1200x500.jpg",
    alt: "Chimney stack before and after repointing",
    title: "Chimney Rebuild & Repoint",
    desc: "Full chimney restoration in Salford",
  },
];

export default function LandingPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const { mutate: submitLead, isPending, isSuccess, isError } = useSubmitLead();
  const [bannerVisible, setBannerVisible] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    postcode: "",
    jobType: "" as JobType | "",
    message: "",
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobType) {
      toast.error("Please select a roofing issue type.");
      return;
    }
    submitLead(
      {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        postcode: formData.postcode,
        jobType: formData.jobType as JobType,
        message: formData.message || null,
      },
      {
        onSuccess: () => {
          toast.success("Quote request submitted! We'll be in touch shortly.");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      },
    );
  };

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Urgency Banner */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              data-ocid="urgency.section"
              className="relative bg-brand-orange py-2.5 px-4 text-white text-sm font-semibold text-center flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>
                High demand this week — our roofers have limited availability.
                Secure your free quote now.
              </span>
              <button
                type="button"
                onClick={() => setBannerVisible(false)}
                aria-label="Dismiss banner"
                data-ocid="urgency.close_button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header
        data-ocid="header.section"
        className="sticky top-0 z-50 w-full bg-brand-navy shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-display font-bold text-lg tracking-tight leading-none">
              RoofQuote
              <span className="text-brand-orange"> Connect</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={PHONE_HREF}
              className="flex items-center gap-1.5 text-white hover:text-brand-orange transition-colors font-semibold text-sm sm:text-base"
              aria-label="Call us"
            >
              <Phone className="w-4 h-4 text-brand-orange" />
              <span className="hidden sm:inline">{PHONE_NUMBER}</span>
              <span className="sm:hidden">Call Us</span>
            </a>
            <Link
              to="/dashboard"
              className="text-white/60 hover:text-white text-sm transition-colors px-2 py-1"
              data-ocid="header.admin_link"
            >
              Admin
            </Link>
            <Button
              onClick={scrollToForm}
              size="sm"
              className="bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold px-3 sm:px-5 border-0"
              data-ocid="header.primary_button"
            >
              <span className="hidden sm:inline">Get Free Quote</span>
              <span className="sm:hidden">Free Quote</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        data-ocid="hero.section"
        className="relative min-h-[640px] flex items-center overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-roof-aerial.dim_1440x700.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/75 to-brand-navy/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Hero Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange px-3 py-1 rounded-full text-sm font-semibold mb-4"
              >
                <MapPin className="w-3.5 h-3.5" />
                Serving Manchester &amp; Greater Manchester
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-4"
              >
                Need a Trusted Roofer
                <span className="text-brand-orange"> Near You?</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-xl text-white/85 mb-6 max-w-lg leading-relaxed"
              >
                Get a Free Roofing Quote From Local Professionals Today. Fast
                response, no obligation.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-lg px-8 py-6 shadow-lg border-0"
                >
                  Get My Free Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <a
                  href={PHONE_HREF}
                  className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-lg"
                >
                  <Phone className="w-5 h-5" />
                  {PHONE_NUMBER}
                </a>
              </motion.div>
              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-6 flex flex-wrap gap-4"
              >
                {["Free Quotes", "No Obligation", "Same Day Response"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 text-white/80 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-brand-orange" />
                      {tag}
                    </span>
                  ),
                )}
              </motion.div>
            </motion.div>

            {/* Lead Form Card */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-form p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-1">
                Get Your Free Roofing Quote
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Fill in your details and we'll connect you with local roofers.
              </p>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    data-ocid="form.success_state"
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-9 h-9 text-green-600" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-xl text-brand-navy">
                        Quote Request Submitted!
                      </p>
                      <p className="text-muted-foreground mt-1">
                        A local roofing professional will be in touch shortly.
                      </p>
                    </div>
                    <a
                      href={PHONE_HREF}
                      className="flex items-center gap-2 bg-brand-orange text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-orange-hover transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Or call us: {PHONE_NUMBER}
                    </a>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {isError && (
                      <div
                        data-ocid="form.error_state"
                        className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
                      >
                        Something went wrong. Please try again or call us
                        directly.
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          data-ocid="form.name.input"
                          type="text"
                          placeholder="John Smith"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, name: e.target.value }))
                          }
                          className="border-border focus:border-brand-navy"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          data-ocid="form.phone.input"
                          type="tel"
                          placeholder="07700 900000"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              phone: e.target.value,
                            }))
                          }
                          className="border-border focus:border-brand-navy"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        data-ocid="form.email.input"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                        className="border-border focus:border-brand-navy"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="postcode"
                          className="text-sm font-medium"
                        >
                          Postcode *
                        </Label>
                        <Input
                          id="postcode"
                          data-ocid="form.postcode.input"
                          type="text"
                          placeholder="M1 1AA"
                          required
                          value={formData.postcode}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              postcode: e.target.value.toUpperCase(),
                            }))
                          }
                          className="border-border focus:border-brand-navy uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">
                          Roofing Issue *
                        </Label>
                        <Select
                          value={formData.jobType}
                          onValueChange={(v) =>
                            setFormData((p) => ({
                              ...p,
                              jobType: v as JobType,
                            }))
                          }
                        >
                          <SelectTrigger
                            data-ocid="form.job_type.select"
                            className="border-border focus:border-brand-navy"
                          >
                            <SelectValue placeholder="Select issue type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={JobType.repair}>
                              Roof Repair
                            </SelectItem>
                            <SelectItem value={JobType.replacement}>
                              Roof Replacement
                            </SelectItem>
                            <SelectItem value={JobType.inspection}>
                              Roof Inspection
                            </SelectItem>
                            <SelectItem value={JobType.emergency}>
                              Emergency Repair
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Additional Details{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Textarea
                        id="message"
                        data-ocid="form.message.textarea"
                        placeholder="Tell us more about your roofing problem..."
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        className="border-border focus:border-brand-navy resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      data-ocid="form.submit_button"
                      className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-base py-6 shadow-md border-0 transition-all"
                      size="lg"
                    >
                      {isPending ? (
                        <>
                          <Loader2
                            data-ocid="form.loading_state"
                            className="w-5 h-5 mr-2 animate-spin"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Get My Free Roofing Quote
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting you agree to our{" "}
                      <a
                        href="#privacy"
                        className="underline hover:text-brand-navy"
                      >
                        Privacy Policy
                      </a>
                      . We'll never share your details without consent.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Stat Bar */}
      <section data-ocid="stats.section" className="bg-brand-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center gap-1"
              >
                <span className="text-brand-orange font-display font-bold text-3xl sm:text-4xl leading-none">
                  {stat.number}
                </span>
                <span className="text-white/70 text-sm leading-snug max-w-[140px]">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation Strip */}
      <section
        data-ocid="accreditations.section"
        className="bg-brand-grey border-b border-brand-grey-mid py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">
            All Contractors Are Verified &amp; Accredited
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ACCREDITATIONS.map((acc) => (
              <span
                key={acc.label}
                className="inline-flex items-center gap-2 bg-white border border-brand-grey-mid rounded-full px-4 py-2 text-sm font-medium text-brand-navy shadow-xs"
              >
                <span>{acc.icon}</span>
                {acc.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section data-ocid="trust.section" className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="w-8 h-8 text-brand-orange" />,
                title: "Local Trusted Professionals",
                desc: "Vetted contractors in your area",
              },
              {
                icon: <Clock className="w-8 h-8 text-brand-orange" />,
                title: "Fast Response",
                desc: "Same-day contact from local roofers",
              },
              {
                icon: <FileText className="w-8 h-8 text-brand-orange" />,
                title: "Free Quotes",
                desc: "No charge for estimates ever",
              },
              {
                icon: <Shield className="w-8 h-8 text-brand-orange" />,
                title: "No Obligation",
                desc: "Compare quotes, decide freely",
              },
            ].map((badge, i) => (
              <motion.div
                key={badge.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center gap-3 p-5 bg-brand-grey rounded-xl shadow-card"
              >
                <div className="w-16 h-16 bg-brand-navy/8 rounded-full flex items-center justify-center">
                  {badge.icon}
                </div>
                <div>
                  <p className="font-semibold text-brand-navy text-sm sm:text-base">
                    {badge.title}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                    {badge.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section data-ocid="how_it_works.section" className="py-16 bg-brand-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-navy mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Getting your free roofing quote is simple and takes less than 2
              minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-brand-grey-mid" />
            {[
              {
                step: "01",
                icon: <Wrench className="w-7 h-7 text-white" />,
                title: "Tell Us About Your Problem",
                desc: "Fill in our quick form with your details and the type of roofing issue you're experiencing.",
              },
              {
                step: "02",
                icon: <Users className="w-7 h-7 text-white" />,
                title: "We Connect You With Roofers",
                desc: "We match your request with trusted, vetted local roofing contractors in Manchester and Greater Manchester.",
              },
              {
                step: "03",
                icon: <FileText className="w-7 h-7 text-white" />,
                title: "Receive Your Free Quote",
                desc: "Get contacted quickly with competitive, no-obligation quotes from local professionals.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center gap-4 relative"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-brand-navy rounded-full flex items-center justify-center shadow-card">
                    {step.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-brand-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {step.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-brand-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="text-center mt-10"
          >
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-6 text-lg border-0"
            >
              Start Now — It's Free
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section data-ocid="benefits.section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-navy mb-3">
              Why Choose RoofQuote Connect?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We make finding reliable roofing help fast, easy, and stress-free.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Clock className="w-6 h-6 text-brand-orange" />,
                title: "Fast Response Times",
                desc: "Contractors typically respond within hours, not days. Emergency services available 24/7.",
              },
              {
                icon: <MapPin className="w-6 h-6 text-brand-orange" />,
                title: "Manchester Based",
                desc: "We only connect you with established roofers operating across Manchester and Greater Manchester.",
              },
              {
                icon: <FileText className="w-6 h-6 text-brand-orange" />,
                title: "Free Quotes",
                desc: "You'll never pay a penny for quotes. Our service is completely free for homeowners.",
              },
              {
                icon: <Shield className="w-6 h-6 text-brand-orange" />,
                title: "Trusted Professionals",
                desc: "All contractors are background-checked and reviewed by real homeowners like you.",
              },
              {
                icon: <ThumbsUp className="w-6 h-6 text-brand-orange" />,
                title: "No Obligation",
                desc: "Receive quotes and decide in your own time. Absolutely no pressure to proceed.",
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-brand-orange" />,
                title: "All Roofing Types",
                desc: "From flat roofs to Victorian slates, our network covers all roofing materials and styles.",
              },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i % 3}
                className="bg-brand-grey rounded-xl p-6 shadow-card flex gap-4 items-start group hover:shadow-card-hover transition-shadow"
              >
                <div className="w-11 h-11 bg-brand-navy/8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-navy/12 transition-colors">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Section */}
      <section data-ocid="before_after.section" className="py-16 bg-brand-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-navy mb-3">
              See The Difference We Make
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Hundreds of Manchester homes transformed by our vetted roofing
              contractors.
            </p>
          </motion.div>

          <div className="space-y-8">
            {BEFORE_AFTERS.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl overflow-hidden shadow-card-hover bg-white"
              >
                <div className="relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full object-cover"
                    style={{ aspectRatio: "12/5" }}
                  />
                  <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                    Before
                  </div>
                  <div className="absolute top-4 right-4 bg-brand-orange text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                    After
                  </div>
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/80 shadow-sm" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center">
                    <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                      <ChevronRight className="w-4 h-4 text-brand-navy -ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-navy">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Roofer in action + stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="mt-8 grid lg:grid-cols-2 gap-6 items-start"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src="/assets/generated/roofer-closeup.dim_800x600.jpg"
                alt="Roofer laying new slate tiles in Manchester"
                className="w-full object-cover"
                style={{ aspectRatio: "4/3" }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/90 to-transparent px-5 py-4">
                <p className="text-white text-sm font-medium">
                  Our vetted contractors at work across Manchester
                </p>
              </div>
            </div>

            {/* Job completion stats */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-card">
                <img
                  src="/assets/generated/roofer-working.dim_800x600.jpg"
                  alt="Professional roofer at work"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-navy/90 to-transparent px-5 py-4">
                  <p className="text-white text-sm font-medium">
                    Professional, safe, and reliable every time
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { number: "47", label: "Roofs Repaired This Month" },
                  { number: "12", label: "Full Replacements Completed" },
                  { number: "3", label: "Emergency Call-Outs This Week" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white rounded-xl p-4 text-center shadow-card"
                  >
                    <p className="font-display font-bold text-2xl text-brand-orange">
                      {s.number}
                    </p>
                    <p className="text-muted-foreground text-xs leading-tight mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section data-ocid="gallery.section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-navy mb-3">
              Recent Completed Jobs
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A snapshot of recent roofing work completed by our network of
              Manchester contractors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY.map((item, i) => (
              <motion.div
                key={item.src}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i % 3}
                className="relative rounded-xl overflow-hidden shadow-card group cursor-pointer"
                data-ocid={`gallery.item.${i + 1}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ aspectRatio: "4/3" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold text-sm">
                    {item.label}
                  </p>
                </div>
                {/* Always visible label */}
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-navy/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
            className="text-center mt-8"
          >
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-brand-navy hover:bg-brand-navy/90 text-white font-bold px-8 py-6 text-lg border-0"
            >
              Get a Quote for Your Roof
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Meet the Team */}
      <section data-ocid="team.section" className="py-16 bg-brand-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-navy mb-3">
              Meet Your Local Roofers
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Experienced professionals covering every area of Manchester and
              Greater Manchester.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="rounded-2xl overflow-hidden shadow-card-hover"
            >
              <img
                src="/assets/generated/team-photo.dim_1200x600.jpg"
                alt="RoofQuote Connect roofing team in Manchester"
                className="w-full object-cover"
                style={{ aspectRatio: "2/1" }}
              />
            </motion.div>

            <div className="space-y-4">
              {TEAM.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 1}
                  className="bg-white rounded-xl p-5 shadow-card flex items-center gap-4"
                  data-ocid={`team.item.${i + 1}`}
                >
                  <div className="w-14 h-14 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {member.name[0]}
                  </div>
                  <div>
                    <p className="font-display font-bold text-brand-navy">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                    <p className="text-xs text-brand-orange font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {member.area}
                    </p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto shrink-0" />
                </motion.div>
              ))}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={4}
                className="bg-brand-navy rounded-xl p-5 text-center"
              >
                <p className="text-white font-semibold mb-1">
                  + 40 more contractors across Greater Manchester
                </p>
                <p className="text-white/60 text-sm">
                  All vetted, insured, and reviewed by homeowners
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-ocid="testimonials.section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-8"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-navy mb-3">
              What Manchester Homeowners Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Trusted by homeowners across Manchester and Greater Manchester
            </p>
          </motion.div>

          {/* Aggregate review summary bar */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="bg-brand-grey rounded-2xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="text-center">
                <span className="font-display font-bold text-5xl text-brand-navy leading-none">
                  4.9
                </span>
                <div className="flex justify-center mt-1">
                  {STAR_KEYS.map((k) => (
                    <Star
                      key={k}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-brand-navy text-base">
                  Based on 312 verified reviews
                </p>
                <p className="text-muted-foreground text-sm">
                  From real homeowners across Manchester
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-end gap-3">
              {[
                {
                  label: "Google Reviews",
                  color: "bg-blue-50 text-blue-700 border-blue-200",
                },
                {
                  label: "Trustpilot",
                  color: "bg-green-50 text-green-700 border-green-200",
                },
                {
                  label: "Facebook",
                  color: "bg-indigo-50 text-indigo-700 border-indigo-200",
                },
              ].map((platform) => (
                <span
                  key={platform.label}
                  className={`inline-flex items-center border rounded-full px-4 py-1.5 text-sm font-semibold ${platform.color}`}
                >
                  {platform.label}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white border border-border rounded-2xl p-6 shadow-card relative"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="absolute top-4 right-5 text-5xl text-brand-navy/10 font-display font-bold leading-none">
                  &ldquo;
                </div>
                <StarRating count={t.rating} />
                <p className="text-foreground leading-relaxed mt-3 mb-4 text-sm">
                  {t.text}
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                  <div className="w-9 h-9 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        data-ocid="cta.section"
        className="py-20 bg-brand-navy relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/40 text-brand-orange px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            >
              <CheckCircle className="w-4 h-4" />
              100% Free Service for Homeowners
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 text-balance"
            >
              Get Your Free Roofing Quote Now
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/80 text-xl mb-8 max-w-xl mx-auto"
            >
              Join homeowners across Manchester who found trusted local roofers
              through RoofQuote Connect.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={scrollToForm}
                size="lg"
                data-ocid="cta.primary_button"
                className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xl px-10 py-7 shadow-lg border-0"
              >
                Get My Free Quote
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
              <a
                href={PHONE_HREF}
                className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                <Phone className="w-5 h-5" />
                {PHONE_NUMBER}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer data-ocid="footer.section" className="bg-brand-navy-dark py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-brand-orange rounded flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-display font-bold text-lg">
                  RoofQuote <span className="text-brand-orange">Connect</span>
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                RoofQuote Connect connects homeowners in Manchester and Greater
                Manchester with local roofing contractors. We are not a roofing
                company. All contractors are independent professionals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  {
                    label: "Get a Free Quote",
                    href: "#",
                    action: scrollToForm,
                  },
                  { label: "How It Works", href: "#how-it-works" },
                ].map((link) => (
                  <li key={link.label}>
                    {link.action ? (
                      <button
                        type="button"
                        onClick={link.action}
                        className="text-white/60 hover:text-white text-sm transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Contact &amp; Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href={PHONE_HREF}
                    className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {PHONE_NUMBER}
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:roofquoteconnect@gmail.com"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    roofquoteconnect@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Facebook className="w-3.5 h-3.5" />
                  Roof quote connect
                </li>
                <li>
                  <a
                    id="privacy"
                    href="#privacy"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/40 text-xs">
              &copy; {year}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                Built with love using caffeine.ai
              </a>
            </p>
            <p className="text-white/30 text-xs text-center">
              RoofQuote Connect is a lead generation service. We connect
              homeowners with independent contractors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
