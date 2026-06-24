import {
  Button,
  Column,
  Form,
  FormGroup,
  Grid,
  InlineLoading,
  InlineNotification,
  Stack,
  TextArea,
  TextInput,
  Tile,
} from "@carbon/react";
import { Email, Location, Phone } from "@carbon/icons-react";
import { useContactForm } from "../components/useContactForm";
import styles from "./contact.module.scss";

interface ContactDetail {
  icon: typeof Email;
  title: string;
  lines: { label: string; href?: string }[];
}

const CONTACT_DETAILS: ContactDetail[] = [
  {
    icon: Location,
    title: "Address",
    lines: [{ label: "Kabulengwa SDA Church" }, { label: "Kampala, Uganda" }],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: [
      { label: "+256 700 000 000", href: "tel:+256700000000" },
      { label: "+256 700 000 001", href: "tel:+256700000001" },
    ],
  },
  {
    icon: Email,
    title: "Email",
    lines: [
      {
        label: "info@kabulengwachurch.org",
        href: "mailto:info@kabulengwachurch.org",
      },
      {
        label: "support@faithops.app",
        href: "mailto:support@faithops.app",
      },
    ],
  },
];

const SERVICE_TIMES = [
  { label: "Sabbath School", time: "9:00 AM – 10:00 AM" },
  { label: "Divine Service", time: "12:00 PM – 1:00 PM" },
  { label: "Wednesday Fellowship", time: "5:00 PM – 6:30 PM" },
  { label: "Friday Prayer", time: "5:00 PM – 6:00 PM" },
];

const ContactPage = () => {
  const {
    formData,
    errors,
    status,
    errorMessage,
    handleChange,
    handleSubmit,
    dismissNotification,
  } = useContactForm();

  const isSubmitting = status === "submitting";

  return (
    <div className={styles.contactPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Contact Us</h1>
        <p className={styles.heroSubtitle}>
          We would love to hear from you. Reach out with prayer requests,
          questions, or feedback.
        </p>
      </div>

      <Grid>
        <Column lg={16} md={8} sm={4}>
          <blockquote className={styles.bibleVerse}>
            &ldquo;Let us then approach God&apos;s throne of grace with
            confidence, so that we may receive mercy and find grace to help us
            in our time of need.&rdquo;
            <span className={styles.verseRef}>— Hebrews 4:16 (NIV)</span>
          </blockquote>
        </Column>

        <Column lg={8} md={8} sm={4}>
          <section
            className={styles.infoSection}
            aria-labelledby="get-in-touch-heading"
          >
            <h2 id="get-in-touch-heading" className={styles.infoSectionHeading}>
              Get in Touch
            </h2>
            <Grid fullWidth condensed>
              {CONTACT_DETAILS.map(({ icon: Icon, title, lines }) => (
                <Column sm={4} md={4} lg={16} key={title}>
                  <Tile className={styles.infoTile}>
                    <Icon size={24} className={styles.infoIcon} />
                    <h3 className={styles.infoTitle}>{title}</h3>
                    <p className={styles.infoDetail}>
                      {lines.map(({ label, href }, idx) => (
                        <span key={label}>
                          {href ? <a href={href}>{label}</a> : label}
                          {idx < lines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </Tile>
                </Column>
              ))}
            </Grid>
          </section>

          <section
            className={styles.infoSection}
            aria-labelledby="service-times-heading"
          >
            <h2
              id="service-times-heading"
              className={styles.infoSectionHeading}
            >
              Service Times
            </h2>
            <Tile className={styles.serviceTile}>
              <dl>
                {SERVICE_TIMES.map(({ label, time }) => (
                  <div className={styles.serviceRow} key={label}>
                    <dt className={styles.serviceLabel}>{label}</dt>
                    <dd className={styles.serviceTime}>{time}</dd>
                  </div>
                ))}
              </dl>
            </Tile>
          </section>
        </Column>

        <Column lg={8} md={8} sm={4}>
          <Tile className={styles.contactTile}>
            <h2 className={styles.formHeading}>Send Us a Message</h2>

            <div aria-live="polite" className={styles.notificationWrapper}>
              {status === "success" && (
                <InlineNotification
                  kind="success"
                  title="Thank you!"
                  subtitle="Your message has been received. We'll get back to you soon. May God richly bless you!"
                  lowContrast
                  onClose={dismissNotification}
                />
              )}

              {status === "error" && (
                <InlineNotification
                  kind="error"
                  title="Message not sent"
                  subtitle={
                    errorMessage ??
                    "Something went wrong while sending your message. Please try again."
                  }
                  lowContrast
                  onClose={dismissNotification}
                />
              )}
            </div>

            <Form onSubmit={handleSubmit} aria-label="Contact form">
              <Stack gap={6}>
                <TextInput
                  id="contact-name"
                  labelText="Your name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  invalid={Boolean(errors.name)}
                  invalidText={errors.name}
                  disabled={isSubmitting}
                />

                <TextInput
                  id="contact-email"
                  type="email"
                  labelText="Email address"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  invalid={Boolean(errors.email)}
                  invalidText={errors.email}
                  disabled={isSubmitting}
                />

                <TextInput
                  id="contact-subject"
                  labelText="Subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  invalid={Boolean(errors.subject)}
                  invalidText={errors.subject}
                  disabled={isSubmitting}
                />

                <FormGroup legendText="Your message">
                  <TextArea
                    id="contact-message"
                    labelText="Message"
                    placeholder="Share your prayer request, question, or feedback..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    invalid={Boolean(errors.message)}
                    invalidText={errors.message}
                    disabled={isSubmitting}
                    rows={5}
                  />
                </FormGroup>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <InlineLoading description="Sending message..." />
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </Stack>
            </Form>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
};

export default ContactPage;
