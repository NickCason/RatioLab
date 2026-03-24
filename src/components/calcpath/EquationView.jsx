import { KatexBlock } from "../ui";

export function EquationView({ latexSections }) {
  return (
    <div className="eq-sections">
      {latexSections.map((section, index) => (
        <div key={index}>
          {index > 0 && <hr className="eq-hr" />}
          <div className="eq-block">
            <div className="eq-block-title">{section.title}</div>
            <KatexBlock tex={section.tex} />
          </div>
        </div>
      ))}
    </div>
  );
}
