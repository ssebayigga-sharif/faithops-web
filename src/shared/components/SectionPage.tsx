type SectionPageProps = {
  title: string;
  description: string;
};

export const SectionPage = ({ title, description }: SectionPageProps) => (
  <div className="page-placeholder">
    <p className="page-placeholder__eyebrow">FaithOps workspace</p>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);
