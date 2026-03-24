export function TableView({ formulaLines }) {
  const groups = [];
  let current = null;

  formulaLines.forEach((line) => {
    if (line.section) {
      current = { title: line.section, rows: [] };
      groups.push(current);
    } else if (current) {
      current.rows.push(line);
    }
  });

  return groups.map((group, groupIndex) => (
    <div key={groupIndex} className="tbl-group">
      <div className="tbl-group-hdr">{group.title}</div>
      <div className="tbl-group-body">
        {group.rows.map((line, lineIndex) => (
          <div key={lineIndex} className="fln">
            <span className="fla">{line.l}</span>
            {line.raw ? <span className="flf" dangerouslySetInnerHTML={{ __html: line.m }} /> : <span className="flf">{line.m}</span>}
            {line.raw ? <span className="flv" dangerouslySetInnerHTML={{ __html: `= ${line.v}` }} /> : <span className="flv">= {line.v}</span>}
          </div>
        ))}
      </div>
    </div>
  ));
}
