export default function SectionTitle({ kicker, title, subtitle }) {
  return (
    <div className="section-title">
      {kicker ? <span className="kicker">{kicker}</span> : null}
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  )
}
