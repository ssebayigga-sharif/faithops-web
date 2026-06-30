import { useState, useMemo } from "react";
import {
  Grid,
  Column,
  Tile,
  Accordion,
  AccordionItem,
  Search,
  TextInput,
  TextArea,
  Button,
  InlineNotification,
  Heading,
  Section,
} from "@carbon/react";
import styles from "../help.module.scss";
import { submitHelpRequest } from "../services/helpRequests";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do I reset my password?",
    answer:
      'Go to the login page and click "Forgot Password." Enter your registered email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.',
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Navigate to your Profile page from the sidebar. You can edit your personal information, contact details, and ministry preferences. Click 'Save' to apply your changes.",
  },
  {
    question: "How do I record attendance for a service?",
    answer:
      "Go to the Attendance section, select the service date and type, then mark each member as Present, Absent, Late, or Excused. You can also add visitors. Click 'Save' to record the session.",
  },
  {
    question: "How do I add a new member to the church directory?",
    answer:
      "Navigate to Members, click 'Add Member,' and fill in their details. Required fields include Name, Phone, and Email. Once saved, the member will appear in the directory and attendance lists.",
  },
  {
    question: "How do I record tithes and offerings?",
    answer:
      "Go to the Giving section and click 'Record Giving.' Fill in the member, amount, category (Tithe, Offering, etc.), and date. You can view reports under the Reports tab within Giving.",
  },
  {
    question: "How do I generate a giving report?",
    answer:
      "In the Giving section, go to the Reports tab. You can generate Monthly, Yearly, or Custom period reports. Select the desired period and click to view the summary with category breakdowns.",
  },
  {
    question: "What roles are available and what are their permissions?",
    answer:
      "Roles include Member, Deacon, Elder, Treasurer, and Pastor. Members can view their profile and giving history. Admin roles (Deacon, Elder, Treasurer, Pastor) can manage members, attendance, events, and reports.",
  },
];

const RESOURCES = [
  {
    title: "User Guide",
    desc: "Comprehensive documentation covering all features and workflows in FaithOps.",
  },
  {
    title: "Video Tutorials",
    desc: "Step-by-step video guides for common tasks like attendance and giving.",
  },
  {
    title: "Privacy & Security",
    desc: "Learn how your data is protected and our commitment to confidentiality.",
  },
  {
    title: "Community Forum",
    desc: "Connect with other church administrators and share best practices.",
  },
];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof ContactFormData, string>>;

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: ContactFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Enter your name.";
  if (!data.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.subject.trim()) errors.subject = "Enter a subject.";
  if (!data.message.trim()) {
    errors.message = "Enter a message.";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }
  return errors;
}

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const filteredFaqs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return FAQS;
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitState("submitting");
    try {
      await submitHelpRequest(formData);
      setSubmitState("success");
      setFormData(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      console.error("Failed to submit help request:", err);
      setSubmitState("error");
    }
  };

  return (
    <div className="admin-page help-page">
      <div className="admin-page__inner">
        <div className={styles.helpPage}>
          <div className={styles.hero}>
            <Heading className={styles.heroTitle}>Help Center</Heading>
            <p className={styles.heroSubtitle}>
              Find answers to common questions, access resources, or reach out
              to our support team. We are here to help you serve your church
              community faithfully.
            </p>
          </div>

          <Grid className={styles.helpGrid} fullWidth>
            <Column lg={9} md={8} sm={4}>
              <Section level={2} className={styles.section}>
                <Heading className={styles.sectionTitle}>
                  Frequently Asked Questions
                </Heading>

                <Search
                  labelText="Search FAQs"
                  placeholder="Search questions and answers"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.faqSearch}
                  size="lg"
                />

                {filteredFaqs.length > 0 ? (
                  <Accordion className={styles.faqAccordion}>
                    {filteredFaqs.map((faq) => (
                      <AccordionItem key={faq.question} title={faq.question}>
                        <p>{faq.answer}</p>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <InlineNotification
                    kind="info"
                    lowContrast
                    hideCloseButton
                    title="No matching questions"
                    subtitle="Try a different search term, or reach out using the form."
                  />
                )}
              </Section>

              <Section level={2} className={styles.section}>
                <Heading className={styles.sectionTitle}>
                  Support Resources
                </Heading>
                <div className={styles.resourceGrid}>
                  {RESOURCES.map((r) => (
                    <Tile key={r.title} className={styles.resourceCard}>
                      <h3 className={styles.resourceTitle}>{r.title}</h3>
                      <p className={styles.resourceDesc}>{r.desc}</p>
                    </Tile>
                  ))}
                </div>
              </Section>
            </Column>

            <Column lg={7} md={8} sm={4}>
              <Section level={2} className={styles.section}>
                <Heading className={styles.sectionTitle}>
                  Contact Support
                </Heading>
                <Tile className={styles.contactCard}>
                  {submitState === "success" && (
                    <InlineNotification
                      kind="success"
                      lowContrast
                      title="Message sent"
                      subtitle="Our team will respond within 24 hours. May God bless you!"
                      onCloseButtonClick={() => setSubmitState("idle")}
                      className={styles.formNotification}
                    />
                  )}
                  {submitState === "error" && (
                    <InlineNotification
                      kind="error"
                      lowContrast
                      title="Couldn't send your message"
                      subtitle="Please check your connection and try again."
                      onCloseButtonClick={() => setSubmitState("idle")}
                      className={styles.formNotification}
                    />
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <Grid narrow>
                      <Column sm={4} className={styles.formGroup}>
                        <TextInput
                          id="help-name"
                          name="name"
                          labelText="Your name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          invalid={!!errors.name}
                          invalidText={errors.name}
                        />
                      </Column>

                      <Column sm={4} className={styles.formGroup}>
                        <TextInput
                          id="help-email"
                          name="email"
                          type="email"
                          labelText="Email address"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          invalid={!!errors.email}
                          invalidText={errors.email}
                        />
                      </Column>

                      <Column sm={4} className={styles.formGroup}>
                        <TextInput
                          id="help-subject"
                          name="subject"
                          labelText="Subject"
                          placeholder="What can we help you with?"
                          value={formData.subject}
                          onChange={handleChange}
                          invalid={!!errors.subject}
                          invalidText={errors.subject}
                        />
                      </Column>

                      <Column sm={4} className={styles.formGroup}>
                        <TextArea
                          id="help-message"
                          name="message"
                          labelText="Message"
                          placeholder="Describe your issue or question in detail..."
                          value={formData.message}
                          onChange={handleChange}
                          invalid={!!errors.message}
                          invalidText={errors.message}
                          rows={5}
                        />
                      </Column>

                      <Column sm={4} className={styles.formGroup}>
                        <Button
                          type="submit"
                          className={styles.submitButton}
                          disabled={submitState === "submitting"}
                        >
                          {submitState === "submitting"
                            ? "Sending..."
                            : "Send message"}
                        </Button>
                      </Column>
                    </Grid>
                  </form>
                </Tile>
              </Section>
            </Column>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
