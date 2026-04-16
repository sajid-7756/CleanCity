import Container from "./Container";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "How do I report an issue?",
    a: "Simply sign in to your account, click 'Add Issues', fill out the details including the category and location, and submit. You can even upload images to help us understand the problem.",
  },
  {
    q: "What happens after I submit a report?",
    a: "Your report is immediately visible to our team and local authorities. You'll receive updates through your dashboard as the status changes from 'Pending' to 'In Progress' and finally 'Resolved'.",
  },
  {
    q: "Can I volunteer for cleanup drives?",
    a: "Yes! Check the 'Volunteer' section on our homepage or look for issues marked with a 'Volunteer Needed' status to join local initiatives.",
  },
  {
    q: "Is CleanCity available in my city?",
    a: "We are currently expanding rapidly. Check our coverage map or try entering your location during the reporting process to see if we support your area.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-secondary py-20 text-secondary-content">
      <Container>
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="space-y-6 lg:w-1/3">
            <h2 className="mb-4 text-4xl font-extrabold">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-secondary-content/70">
              Got questions? We've got answers. If you don't find what you're looking
              for, feel free to contact us.
            </p>
            <button className="btn btn-primary px-8">View All FAQs</button>
          </div>
          <div className="space-y-4 lg:w-2/3">
            {faqs.map((faq, index) => (
              <div
                key={faq.q}
                className="collapse collapse-plus rounded-2xl border border-base-100/10 bg-base-100/5"
              >
                <input type="radio" name="my-accordion-3" defaultChecked={index === 0} />
                <div className="collapse-title flex items-center gap-4 px-8 py-6 text-xl font-bold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm text-primary">
                    {index + 1}
                  </span>
                  {faq.q}
                </div>
                <div className="collapse-content px-8 pb-6">
                  <p className="pl-12 leading-relaxed text-secondary-content/60">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
