import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Droplets,
  FlaskConical,
  Heart,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Sprout,
  X,
} from "lucide-react";
import {
  ADDRESS,
  MAPS_URL,
  MOVEMENT_URL,
  PHONE_DISPLAY,
  PHONE_E164,
  buildEnquiry,
  emptyForm,
  hamperIncludes,
  hampers,
  isEnquiryForm,
  isIndianMobile,
  products,
  seasonal,
  testimonials,
  trust,
  whatsappLink,
  type Badge,
  type EnquiryForm,
  type Product,
} from "@/data/catalog";

const filters: Array<"All" | Badge> = ["All", "Pantry", "On order", "Subscription", "Gifting"];

const trustIcons = [Leaf, FlaskConical, Sprout, Heart];

const DRAFT_KEY = "grink-enquiry";

function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-widest text-honey uppercase">{children}</p>
  );
}

export function Site() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [active, setActive] = useState<Product | null>(null);
  const [form, setForm] = useState<EnquiryForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryForm, string>>>({});
  const [sent, setSent] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [payError, setPayError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isEnquiryForm(parsed)) setForm(parsed);
      }
    } catch {
      /* ignore a broken draft */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form, ready]);

  function addPick(label: string) {
    setForm((current) => {
      if (current.picks.includes(label)) return current;
      const line = `• ${label}`;
      const requirement = current.requirement.trim()
        ? `${current.requirement.trim()}\n${line}`
        : line;
      return { ...current, picks: [...current.picks, label], requirement };
    });
    setSent("");
    setErrors((current) => ({ ...current, requirement: undefined }));
  }

  function update<K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function submitEnquiry(event: FormEvent) {
    event.preventDefault();
    const next: Partial<Record<keyof EnquiryForm, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please add your name.";
    if (!isIndianMobile(form.phone)) next.phone = "Enter a 10-digit mobile number.";
    if (form.address.trim().length < 8) next.address = "Add the address we should deliver to.";
    if (form.requirement.trim().length < 3) next.requirement = "Tell us what you would like.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const message = buildEnquiry(form);
    setSent(message);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  function submitPayment(event: FormEvent) {
    event.preventDefault();
    const amount = Number(payAmount.replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      setPayError("Enter the amount in rupees.");
      return;
    }
    setPayError("");
    const message = [
      "Namaste Grink Agro,",
      "",
      "I would like to make a payment.",
      `Amount: ₹${amount}`,
      payNote.trim() ? `For: ${payNote.trim()}` : "",
      form.name.trim() ? `Name: ${form.name.trim()}` : "",
      form.phone.trim() ? `Phone: ${form.phone.trim()}` : "",
      "",
      "Please share the payment details.",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  const visible = products.filter((item) => filter === "All" || item.badge === filter);
  const pickCount = form.picks.length;

  return (
    <div id="top" className="min-h-screen">
      <a
        href="#pantry"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to the pantry
      </a>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} pickCount={pickCount} />
      <main>
        <Hero />
        <Trust />
        <Pantry
          filter={filter}
          setFilter={setFilter}
          visible={visible}
          onOpen={setActive}
          onAdd={addPick}
          picks={form.picks}
        />
        <GheeStory onAdd={addPick} picked={form.picks.includes("A2 Gir Cow Ghee")} />
        <HoneyStory onAdd={addPick} picked={form.picks.includes("Raw Honey")} />
        <Hampers onAdd={addPick} picks={form.picks} />
        <Seasonal />
        <Story />
        <Table />
        <Voices />
        <Movement />
        <OrderDesk
          form={form}
          errors={errors}
          sent={sent}
          update={update}
          onSubmit={submitEnquiry}
          onReset={() => {
            setForm(emptyForm);
            setSent("");
            setErrors({});
            localStorage.removeItem(DRAFT_KEY);
          }}
          payAmount={payAmount}
          payNote={payNote}
          payError={payError}
          setPayAmount={(value) => {
            setPayAmount(value);
            setPayError("");
          }}
          setPayNote={setPayNote}
          onPay={submitPayment}
        />
      </main>
      <Footer />
      <ProductDialog
        product={active}
        onClose={() => setActive(null)}
        picked={active ? form.picks.includes(active.name) : false}
        onAdd={() => {
          if (!active) return;
          addPick(active.name);
        }}
      />
      {pickCount > 0 && !sent && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <a
            href="#order"
            className="btn btn-primary shadow-card max-w-md flex-1 sm:flex-none"
          >
            {pickCount} in your enquiry
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}

function Header({
  menuOpen,
  setMenuOpen,
  pickCount,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  pickCount: number;
}) {
  const links = [
    ["Pantry", "#pantry"],
    ["Ghee & honey", "#ghee"],
    ["Hampers", "#hampers"],
    ["Our story", "#story"],
    ["Voices", "#voices"],
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-3 py-2">
        <a href="#top" className="logo-slot" aria-label="Grink Agro, home">
          <img src="/media/logo-mark.jpg" alt="Grink" />
        </a>
        <nav className="hidden items-center gap-5 text-sm text-ink lg:flex" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-forest">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#order" className="btn btn-primary hidden px-4 sm:inline-flex">
            Enquire{pickCount > 0 ? ` · ${pickCount}` : ""}
          </a>
          <button
            type="button"
            className="btn btn-ghost size-11 px-0 lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </Container>
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-cream px-6 py-6 shadow-card outline-none">
            <div className="flex items-center justify-between">
              <Dialog.Title className="font-display text-2xl text-forest">Grink</Dialog.Title>
              <Dialog.Close className="btn btn-ghost size-11 px-0" aria-label="Close menu">
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">Site sections</Dialog.Description>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
              {[...links, ["Order", "#order"] as const].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display border-b border-line py-3 text-3xl text-ink"
                >
                  {label}
                </a>
              ))}
            </nav>
            <a href={`tel:+${PHONE_E164}`} className="btn btn-primary mt-8">
              <Phone className="size-4" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-8 pb-6 sm:pt-12">
      <Container className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow>Grink Agro LLP · Ahmedabad</Eyebrow>
          <h1 className="font-display display-title mt-3 text-5xl text-ink sm:text-6xl">
            Goodness for a <span className="text-forest italic">healthier</span> tomorrow
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Pure goodness from nature. A2 Gir cow ghee, raw multiflora honey, cold-pressed
            juices and hampers packed with India’s everyday traditions.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#order" className="btn btn-primary">
              <MessageCircle className="size-4" aria-hidden="true" />
              Start an enquiry
            </a>
            <a href="#pantry" className="btn btn-ghost">
              Browse the pantry
            </a>
          </div>
          <p className="mt-6 text-sm tracking-widest text-muted uppercase">
            Pure · Natural · Healthy
          </p>
        </div>
        <figure className="lg:col-span-7">
          <img
            src="/media/hero-table.jpg"
            alt="Grink ghee, raw honey, cold-pressed juices, lip balm, sprouts, brown rice and a gift hamper on a wooden table"
            className="w-full rounded-card shadow-card"
          />
        </figure>
      </Container>
    </section>
  );
}

function Trust() {
  return (
    <section className="py-6" aria-label="What we stand for">
      <Container>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item, index) => {
            const Icon = trustIcons[index] ?? Leaf;
            return (
              <li
                key={item.title}
                className="flex gap-3 rounded-2xl border border-line bg-paper/80 p-4"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-leaf text-forest">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium text-ink">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

function Pantry({
  filter,
  setFilter,
  visible,
  onOpen,
  onAdd,
  picks,
}: {
  filter: (typeof filters)[number];
  setFilter: (value: (typeof filters)[number]) => void;
  visible: Product[];
  onOpen: (product: Product) => void;
  onAdd: (name: string) => void;
  picks: string[];
}) {
  return (
    <section id="pantry" className="scroll-mt-36 py-14">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>The pantry</Eyebrow>
            <h2 className="font-display mt-2 text-4xl text-ink md:text-5xl">
              What we pack today
            </h2>
            <p className="mt-3 text-muted">
              Everyday jars, juices pressed on order, a sprouts subscription, and hampers
              with your name on the box.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={filter === item}
                className={`min-h-11 rounded-full px-4 text-sm ${
                  filter === item ? "bg-forest text-on-forest" : "bg-paper text-ink border border-line"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => {
            const picked = picks.includes(product.name);
            return (
              <li key={product.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-card">
                  <button
                    type="button"
                    onClick={() => onOpen(product)}
                    className="block text-left"
                  >
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      className="portrait w-full object-cover"
                    />
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-2xl text-ink">{product.name}</h3>
                      <span className="shrink-0 rounded-full bg-leaf px-2.5 py-1 text-xs font-medium text-forest">
                        {product.badge}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm text-muted">{product.summary}</p>
                    <div className="mt-4 flex gap-2">
                      <button type="button" className="btn btn-ghost flex-1" onClick={() => onOpen(product)}>
                        Details
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary flex-1"
                        onClick={() => onAdd(product.name)}
                        disabled={picked}
                      >
                        {picked ? "Added" : "Add"}
                        {!picked && <Plus className="size-4" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 && (
          <p className="mt-8 text-muted">Nothing in this shelf yet. Try another filter.</p>
        )}
      </Container>
    </section>
  );
}

function LabelScroll({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-x-auto">
        <img src={src} alt={alt} className="label-art" />
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
      <p className="px-5 pt-2 text-center text-xs tracking-wide text-muted md:hidden">
        Swipe sideways to read the full label
      </p>
    </figure>
  );
}

function GheeStory({ onAdd, picked }: { onAdd: (name: string) => void; picked: boolean }) {
  const points = [
    ["Made from A2 Gir cow milk", "Naturally rich in A2 protein and goodness."],
    ["Traditional bilona method", "Hand-churned curd for an authentic taste."],
    ["100% organic", "No chemicals, no shortcuts. Just pure and natural."],
    ["No preservatives or additives", "Nothing artificial. Just the way it should be."],
  ];
  return (
    <section id="ghee" className="scroll-mt-36 bg-paper py-14">
      <LabelScroll
        src="/media/ghee-banner.jpg"
        alt="Grink Premium Gir Cow Ghee. Made from A2 Gir cow milk, traditional bilona method, 100% organic, no preservatives. Pure, natural, traditional."
        caption="Gir cow ghee label"
      />
      <Container className="mt-10 grid items-center gap-8 lg:grid-cols-2">
        <img
          src="/media/ghee-jar.jpg"
          alt="Grink premium Gir cow ghee, 300 ml, on a wooden board"
          className="w-full rounded-card"
        />
        <div>
          <Eyebrow>The goodness of Gir</Eyebrow>
          <h2 className="font-display mt-2 text-4xl text-ink">Premium Gir cow ghee</h2>
          <p className="mt-4 text-muted">
            Churned the slow way, from A2 Gir cow milk. A jar for the kitchen, and a jar
            that belongs in a festive box.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {points.map(([title, text]) => (
              <li key={title}>
                <p className="font-medium text-ink">{title}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-primary mt-7"
            onClick={() => onAdd("A2 Gir Cow Ghee")}
            disabled={picked}
          >
            {picked ? "In your enquiry" : "Add ghee to enquiry"}
          </button>
        </div>
      </Container>
    </section>
  );
}

function HoneyStory({ onAdd, picked }: { onAdd: (name: string) => void; picked: boolean }) {
  return (
    <section id="honey" className="scroll-mt-36 py-14">
      <LabelScroll
        src="/media/honey-banner.jpg"
        alt="Grink Raw Honey. 100% natural multiflora Apis cerana honey. Empowering tribes, preserving nature. 100% natural, no additives, raw and unfiltered, sustainably sourced."
        caption="Raw honey label"
      />
      <Container className="mt-10 grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>From the comb</Eyebrow>
          <h2 className="font-display mt-2 text-4xl text-ink">Raw multiflora honey</h2>
          <p className="mt-4 text-muted">
            Apis cerana honey, left raw and unfiltered. No additives. Sourced in a way that
            keeps the people and the landscape in the story.
          </p>
          <p className="font-display mt-6 text-xl text-forest italic">
            Empowering tribes, preserving nature.
          </p>
          <ul className="mt-6 space-y-2 text-ink">
            {["100% natural", "No additives", "Raw and unfiltered", "Sustainably sourced"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Droplets className="size-4 text-honey" aria-hidden="true" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <button
            type="button"
            className="btn btn-primary mt-7"
            onClick={() => onAdd("Raw Honey")}
            disabled={picked}
          >
            {picked ? "In your enquiry" : "Add honey to enquiry"}
          </button>
        </div>
        <img
          src="/media/slice-honey.jpg"
          alt="Jar of raw honey with honeycomb"
          className="honey-shot w-full rounded-card lg:col-span-7"
        />
      </Container>
    </section>
  );
}

function Hampers({ onAdd, picks }: { onAdd: (name: string) => void; picks: string[] }) {
  return (
    <section id="hampers" className="scroll-mt-36 bg-leaf/60 py-14">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Diwali and every occasion after</Eyebrow>
          <h2 className="font-display mt-2 text-4xl text-ink md:text-5xl">
            Make this gifting personal
          </h2>
          <p className="mt-3 text-muted">
            Thoughtfully curated, elegantly packed, and ready for a home, a host, or a whole
            office. Spread joy, share goodness.
          </p>
        </div>
        <img
          src="/media/hampers.jpg"
          alt="Three Grink Diwali gift hampers: Festive Classic, Premium Delight and Grand Celebration"
          className="mt-8 w-full rounded-card shadow-card"
        />
        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {hampers.map((hamper) => {
            const label = `${hamper.name} — ${hamper.jars} (${hamper.price})`;
            const picked = picks.includes(label);
            return (
              <li key={hamper.id} className="flex flex-col rounded-card border border-line bg-paper p-5">
                <p className="text-xs font-medium tracking-widest text-honey uppercase">
                  {hamper.option}
                </p>
                <h3 className="font-display mt-2 text-3xl text-ink">{hamper.name}</h3>
                <p className="mt-2 text-sm text-muted">{hamper.text}</p>
                <p className="mt-4 text-sm text-ink">{hamper.jars}</p>
                <p className="font-display mt-1 text-2xl text-forest tabular-nums">{hamper.price}</p>
                <button
                  type="button"
                  className="btn btn-primary mt-5"
                  onClick={() => onAdd(label)}
                  disabled={picked}
                >
                  {picked ? "Added" : "Enquire this hamper"}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 rounded-card border border-line bg-paper p-5">
          <h3 className="font-display text-2xl text-ink">Inside the festive collection</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {hamperIncludes.map((item) => (
              <li key={item} className="text-sm text-ink">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            Personalise logos, colours and packaging. Corporate gifting starts from the same
            2 to 6 jar range, at ₹2,500 onwards.
          </p>
        </div>
      </Container>
    </section>
  );
}

function Seasonal() {
  return (
    <section id="seasonal" className="scroll-mt-36 py-14">
      <Container>
        <Eyebrow>Seasonal and upcoming</Eyebrow>
        <h2 className="font-display mt-2 text-4xl text-ink">When the season allows</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {seasonal.map((item) => (
            <li key={item.name} className="rounded-2xl border border-line bg-paper px-4 py-4">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-sm text-muted">{item.note}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="scroll-mt-36 bg-forest py-16 text-on-forest">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium tracking-widest text-leaf uppercase">Vision</p>
          <h2 className="font-display mt-2 text-4xl">
            A trusted Indian brand, in every household
          </h2>
          <p className="mt-4 text-on-forest/90">
            To become a trusted and recognised Indian brand for quality agro-based products,
            bringing the goodness of nature and India’s rich traditions to every household.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-widest text-leaf uppercase">Mission</p>
          <h2 className="font-display mt-2 text-4xl">Rooted in nature and tradition</h2>
          <p className="mt-4 text-on-forest/90">
            To source, curate, and deliver quality products rooted in nature and tradition,
            with a commitment to authenticity, customer trust, responsible practices, and
            lasting partnerships with our business associates and consumers.
          </p>
        </div>
      </Container>
      <p className="font-display mt-12 text-center text-sm tracking-widest">
        PURE · NATURAL · TRADITIONAL
      </p>
    </section>
  );
}

function Table() {
  return (
    <section className="py-14" aria-labelledby="table-title">
      <Container>
        <Eyebrow>In person</Eyebrow>
        <h2 id="table-title" className="font-display mt-2 text-4xl text-ink">
          From our table
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          You will find the same jars at markets around Ahmedabad. Come taste, or send an
          enquiry and we will pack it for you.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <img
            src="/media/stall-portrait.jpg"
            alt="Grink stall at an evening market in Ahmedabad, with ghee, honey, juices and gift boxes"
            className="h-72 w-full rounded-card object-cover object-top md:h-96"
          />
          <img
            src="/media/table.jpg"
            alt="Close view of the Grink table: ghee jars, juice bottles, lip balm tins and gift boxes"
            className="h-72 w-full rounded-card object-cover md:h-96"
          />
        </div>
      </Container>
    </section>
  );
}

function Voices() {
  return (
    <section id="voices" className="scroll-mt-36 bg-paper py-14">
      <Container>
        <Eyebrow>In their words</Eyebrow>
        <h2 className="font-display mt-2 text-4xl text-ink">Households already keeping Grink</h2>
        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name} className="flex flex-col rounded-card border border-line bg-cream p-5">
              <p className="text-xs font-medium tracking-widest text-honey uppercase">{item.product}</p>
              <blockquote className="mt-3 flex-1 text-ink">“{item.quote}”</blockquote>
              <p className="mt-4 font-medium text-forest">{item.name}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Movement() {
  return (
    <section className="py-14">
      <Container className="movement grid items-center gap-8 rounded-card bg-leaf px-5 py-8 md:px-8">
        <img
          src="/media/movement-qr.svg"
          alt="QR code that opens WhatsApp to join the Healthier Happier movement"
          className="mx-auto size-44 rounded-2xl bg-paper p-2"
        />
        <div>
          <Eyebrow>#HealthierHappier</Eyebrow>
          <h2 className="font-display mt-2 text-4xl text-ink">Join the movement</h2>
          <p className="mt-3 max-w-xl text-muted">
            Scan the code, or send a note on WhatsApp. We will welcome you into the
            #HealthierHappier circle and share Instagram and LinkedIn from there.
          </p>
          <a href={MOVEMENT_URL} className="btn btn-primary mt-5" target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" aria-hidden="true" />
            Join on WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-honey">
          {error}
        </p>
      )}
    </div>
  );
}

function OrderDesk({
  form,
  errors,
  sent,
  update,
  onSubmit,
  onReset,
  payAmount,
  payNote,
  payError,
  setPayAmount,
  setPayNote,
  onPay,
}: {
  form: EnquiryForm;
  errors: Partial<Record<keyof EnquiryForm, string>>;
  sent: string;
  update: <K extends keyof EnquiryForm>(key: K, value: EnquiryForm[K]) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  payAmount: string;
  payNote: string;
  payError: string;
  setPayAmount: (value: string) => void;
  setPayNote: (value: string) => void;
  onPay: (event: FormEvent) => void;
}) {
  const base = useId();
  return (
    <section id="order" className="scroll-mt-36 bg-paper py-14">
      <Container className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Eyebrow>Order enquiry</Eyebrow>
          <h2 className="font-display mt-2 text-4xl text-ink">Tell us what to pack</h2>
          <p className="mt-3 text-muted">
            Name, phone, address, what you need, and who sent you. We confirm on WhatsApp
            before anything is packed. Juices are made on order.
          </p>
          {sent ? (
            <div className="mt-6 rounded-card border border-line bg-cream p-5">
              <h3 className="font-display text-2xl text-forest">Your note is ready</h3>
              <p className="mt-2 text-sm text-muted">
                WhatsApp should have opened. If it did not, use the button below. We reply
                on {PHONE_DISPLAY}.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-paper p-4 text-sm whitespace-pre-wrap text-ink">
                {sent}
              </pre>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a href={whatsappLink(sent)} className="btn btn-primary" target="_blank" rel="noreferrer">
                  Open WhatsApp
                </a>
                <button type="button" className="btn btn-ghost" onClick={onReset}>
                  Start another enquiry
                </button>
              </div>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
              <Field id={`${base}-name`} label="Name" error={errors.name}>
                <input
                  id={`${base}-name`}
                  className={`field ${errors.name ? "field-error" : ""}`}
                  autoComplete="name"
                  value={form.name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${base}-name-error` : undefined}
                  onChange={(event) => update("name", event.target.value)}
                />
              </Field>
              <Field id={`${base}-phone`} label="Phone number" error={errors.phone}>
                <input
                  id={`${base}-phone`}
                  className={`field ${errors.phone ? "field-error" : ""}`}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  value={form.phone}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${base}-phone-error` : undefined}
                  onChange={(event) => update("phone", event.target.value)}
                />
              </Field>
              <Field id={`${base}-address`} label="Address" error={errors.address}>
                <textarea
                  id={`${base}-address`}
                  className={`field min-h-24 ${errors.address ? "field-error" : ""}`}
                  autoComplete="street-address"
                  value={form.address}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? `${base}-address-error` : undefined}
                  onChange={(event) => update("address", event.target.value)}
                />
              </Field>
              <Field id={`${base}-need`} label="Requirement" error={errors.requirement}>
                <textarea
                  id={`${base}-need`}
                  className={`field min-h-32 ${errors.requirement ? "field-error" : ""}`}
                  placeholder="Jars, juices, a hamper, or a monthly sprouts order"
                  value={form.requirement}
                  aria-invalid={Boolean(errors.requirement)}
                  aria-describedby={errors.requirement ? `${base}-need-error` : undefined}
                  onChange={(event) => update("requirement", event.target.value)}
                />
              </Field>
              <Field id={`${base}-ref`} label="Reference">
                <input
                  id={`${base}-ref`}
                  className="field"
                  placeholder="A friend, a stall, Instagram"
                  value={form.reference}
                  onChange={(event) => update("reference", event.target.value)}
                />
              </Field>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Send enquiry on WhatsApp
              </button>
            </form>
          )}
        </div>
        <aside className="space-y-4 lg:col-span-2">
          <form onSubmit={onPay} className="rounded-card border border-line bg-cream p-5" noValidate>
            <h3 className="font-display text-2xl text-ink">Quick payment</h3>
            <p className="mt-2 text-sm text-muted">
              Share the amount and what it is for. We confirm on WhatsApp and send the
              payment details. Do not send card numbers here.
            </p>
            <label htmlFor={`${base}-amount`} className="mt-4 mb-1.5 block text-sm font-medium">
              Amount in ₹
            </label>
            <input
              id={`${base}-amount`}
              className={`field ${payError ? "field-error" : ""}`}
              inputMode="decimal"
              value={payAmount}
              onChange={(event) => setPayAmount(event.target.value)}
              aria-invalid={Boolean(payError)}
              aria-describedby={payError ? `${base}-amount-error` : undefined}
            />
            {payError && (
              <p id={`${base}-amount-error`} className="mt-1 text-sm text-honey">
                {payError}
              </p>
            )}
            <label htmlFor={`${base}-for`} className="mt-4 mb-1.5 block text-sm font-medium">
              For
            </label>
            <input
              id={`${base}-for`}
              className="field"
              placeholder="Ghee, hamper, previous order"
              value={payNote}
              onChange={(event) => setPayNote(event.target.value)}
            />
            <button type="submit" className="btn btn-ghost mt-4 w-full">
              Request payment on WhatsApp
            </button>
          </form>
          <div className="rounded-card bg-forest p-5 text-on-forest">
            <h3 className="font-display text-2xl">Visit or call</h3>
            <p className="mt-3 text-sm leading-relaxed">{ADDRESS}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={`tel:+${PHONE_E164}`} className="btn btn-paper">
                <Phone className="size-4" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a href={MAPS_URL} className="btn btn-paper" target="_blank" rel="noreferrer">
                <MapPin className="size-4" aria-hidden="true" />
                Open in Maps
              </a>
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="logo-slot">
            <img src="/media/logo-mark.jpg" alt="" />
          </span>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Grink Agro LLP. Goodness for a healthier tomorrow.
          </p>
        </div>
        <div className="text-sm text-muted">
          <p>{ADDRESS}</p>
          <p className="mt-1">
            <a href={`tel:+${PHONE_E164}`} className="text-forest">
              {PHONE_DISPLAY}
            </a>
          </p>
          <p className="mt-3">
            <a href={MOVEMENT_URL} className="text-forest" target="_blank" rel="noreferrer">
              Instagram & LinkedIn via WhatsApp
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function ProductDialog({
  product,
  onClose,
  onAdd,
  picked,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: () => void;
  picked: boolean;
}) {
  return (
    <Dialog.Root open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Dialog.Content className="sheet fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card bg-paper shadow-card outline-none">
          {product && (
            <>
              <img src={product.image} alt="" className="landscape w-full object-cover" />
              <div className="p-5">
                <p className="text-xs font-medium tracking-widest text-honey uppercase">
                  {product.badge}
                </p>
                <Dialog.Title className="font-display mt-1 text-3xl text-ink">
                  {product.name}
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-muted">{product.summary}</Dialog.Description>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {product.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="mt-5 flex gap-2">
                  <button type="button" className="btn btn-primary flex-1" onClick={onAdd} disabled={picked}>
                    {picked ? "Added to enquiry" : "Add to enquiry"}
                  </button>
                  <Dialog.Close className="btn btn-ghost">Close</Dialog.Close>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
