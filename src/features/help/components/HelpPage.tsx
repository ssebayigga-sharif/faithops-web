// import { useState } from "react";
// import { Grid, Column } from "@carbon/react";
// import { Help, Bookmark, UserFollow, Chat } from "@carbon/icons-react";
// import styles from "../help.module.scss";

// interface FAQItem {
//   question: string;
//   answer: string;
// }

// const FAQS: FAQItem[] = [
//   {
//     question: "How do I reset my password?",
//     answer:
//       'Go to the login page and click "Forgot Password." Enter your registered email address, and we will send you a password reset link. Follow the instructions in the email to create a new password.',
//   },
//   {
//     question: "How do I update my profile information?",
//     answer:
//       "Navigate to your Profile page from the sidebar. You can edit your personal information, contact details, and ministry preferences. Click 'Save' to apply your changes.",
//   },
//   {
//     question: "How do I record attendance for a service?",
//     answer:
//       "Go to the Attendance section, select the service date and type, then mark each member as Present, Absent, Late, or Excused. You can also add visitors. Click 'Save' to record the session.",
//   },
//   {
//     question: "How do I add a new member to the church directory?",
//     answer:
//       "Navigate to Members, click 'Add Member,' and fill in their details. Required fields include Name, Phone, and Email. Once saved, the member will appear in the directory and attendance lists.",
//   },
//   {
//     question: "How do I record tithes and offerings?",
//     answer:
//       "Go to the Giving section and click 'Record Giving.' Fill in the member, amount, category (Tithe, Offering, etc.), and date. You can view reports under the Reports tab within Giving.",
//   },
//   {
//     question: "How do I generate a giving report?",
//     answer:
//       "In the Giving section, go to the Reports tab. You can generate Monthly, Yearly, or Custom period reports. Select the desired period and click to view the summary with category breakdowns.",
//   },
//   {
//     question: "What roles are available and what are their permissions?",
//     answer:
//       "Roles include Member, Deacon, Elder, Treasurer, and Pastor. Members can view their profile and giving history. Admin roles (Deacon, Elder, Treasurer, Pastor) can manage members, attendance, events, and reports.",
//   },
// ];

// const RESOURCES = [
//   {
//     icon: "📖",
//     title: "User Guide",
//     desc: "Comprehensive documentation covering all features and workflows in FaithOps.",
//   },
//   {
//     icon: "🎥",
//     title: "Video Tutorials",
//     desc: "Step-by-step video guides for common tasks like attendance and giving.",
//   },
//   {
//     icon: "🛡️",
//     title: "Privacy & Security",
//     desc: "Learn how your data is protected and our commitment to confidentiality.",
//   },
//   {
//     icon: "💬",
//     title: "Community Forum",
//     desc: "Connect with other church administrators and share best practices.",
//   },
// ];

// const HelpPage: React.FC = () => {
//   const [openFaq, setOpenFaq] = useState<number | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const toggleFaq = (index: number) => {
//     setOpenFaq(openFaq === index ? null : index);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Contact form submitted:", formData);
//     setSubmitted(true);
//     setFormData({ name: "", email: "", subject: "", message: "" });
//   };

//   return (
//     <div className={styles.helpPage}>
//       <div className={styles.hero}>
//         <h1 className={styles.heroTitle}>
//           <Help /> Help Center
//         </h1>
//         <p className={styles.heroSubtitle}>
//           Find answers to common questions, access resources, or reach out to
//           our support team. We are here to help you serve your church community
//           faithfully.
//         </p>
//       </div>

//       <Grid>
//         <Column lg={10} md={8} sm={4}>
//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>
//               <Chat /> Frequently Asked Questions
//             </h2>
//             {FAQS.map((faq, i) => (
//               <div key={i} className={styles.faqItem}>
//                 <button
//                   className={styles.faqQuestion}
//                   onClick={() => toggleFaq(i)}
//                   type="button"
//                 >
//                   <span>{faq.question}</span>
//                   <span>{openFaq === i ? "▲" : "▼"}</span>
//                 </button>
//                 {openFaq === i && (
//                   <div className={styles.faqAnswer}>{faq.answer}</div>
//                 )}
//               </div>
//             ))}
//           </section>

//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>
//               <Bookmark /> Support Resources
//             </h2>
//             <div className={styles.resourceGrid}>
//               {RESOURCES.map((r, i) => (
//                 <div key={i} className={styles.resourceCard}>
//                   <div className={styles.resourceIcon}>{r.icon}</div>
//                   <h3 className={styles.resourceTitle}>{r.title}</h3>
//                   <p className={styles.resourceDesc}>{r.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </Column>

//         <Column lg={6} md={8} sm={4}>
//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>
//               <UserFollow /> Contact Support
//             </h2>
//             <div className={styles.contactCard}>
//               {submitted ? (
//                 <div className={styles.successMessage}>
//                   <strong>Thank you!</strong> Your message has been received.
//                   Our team will respond within 24 hours. May God bless you!
//                 </div>
//               ) : null}

//               <form onSubmit={handleSubmit}>
//                 <div className={styles.formGroup}>
//                   <label className={styles.label} htmlFor="help-name">
//                     Your Name
//                   </label>
//                   <input
//                     id="help-name"
//                     name="name"
//                     className={styles.input}
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     placeholder="Enter your full name"
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label className={styles.label} htmlFor="help-email">
//                     Email Address
//                   </label>
//                   <input
//                     id="help-email"
//                     name="email"
//                     type="email"
//                     className={styles.input}
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="your@email.com"
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label className={styles.label} htmlFor="help-subject">
//                     Subject
//                   </label>
//                   <input
//                     id="help-subject"
//                     name="subject"
//                     className={styles.input}
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     placeholder="What can we help you with?"
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <label className={styles.label} htmlFor="help-message">
//                     Message
//                   </label>
//                   <textarea
//                     id="help-message"
//                     name="message"
//                     className={styles.textarea}
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     placeholder="Describe your issue or question in detail..."
//                   />
//                 </div>

//                 <button type="submit" className={styles.submitButton}>
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </section>
//         </Column>
//       </Grid>
//     </div>
//   );
// };

// export default HelpPage;
