import type { ReactNode } from "react";

type Section = Readonly<{
  id: string;
  title: string;
  paragraphs: readonly string[];
}>;

type Props = Readonly<{
  sections: readonly Section[];
  tocLabel: string;
  styles: Readonly<Record<string, string>>;
  renderExtra?: (sectionId: string) => ReactNode;
}>;

export function LegalSectionsLayout({
  sections,
  tocLabel,
  styles,
  renderExtra,
}: Props) {
  return (
    <div className={styles["contentLayout"]}>
      <nav className={styles["toc"]} aria-label={tocLabel}>
        <h2>في هذه الصفحة</h2>
        <ol>
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                <span>{(index + 1).toLocaleString("ar-EG")}</span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className={styles["article"]}>
        {sections.map((section, index) => (
          <section
            id={section.id}
            key={section.id}
            aria-labelledby={`${section.id}-title`}
          >
            <p className={styles["sectionNumber"]}>
              {(index + 1).toLocaleString("ar-EG")} /{" "}
              {sections.length.toLocaleString("ar-EG")}
            </p>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {renderExtra?.(section.id)}
          </section>
        ))}
      </article>
    </div>
  );
}
