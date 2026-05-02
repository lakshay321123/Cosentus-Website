const items = [
  { tag: 'Anesthesia', quote: '"Year-over-year collection rate of 97% from commercial payors and 98% overall..."', author: '— Dr. John B. Field Jr., MD' },
  { tag: 'Orthopedic', quote: '"My reimbursements increased after they started coding for me..."', author: '— Dr. Morteza Farr, DO' },
  { tag: 'Pain Mgmt', quote: '"Nearly 20 years in practice, Cosentus has provided nothing but positive experiences..."', author: '— Justin Lo, MD' },
  { tag: 'ASC', quote: '"The job they have done on the outstanding balances saved our surgery center..."', author: '— John Welsh, M.D.' },
  { tag: 'Behavioral Health', quote: '"Reducing our Days in AR and improving cash flow..."', author: '— Sujan Vatturi' },
]

export default function TestimonialsTicker() {
  // Duplicate items for seamless loop
  const allItems = [...items, ...items]

  return (
    <div className="testimonials-strip">
      <div className="testimonials-track">
        {allItems.map((item, i) => (
          <div key={i} className="testimonial-item">
            <span className="testimonial-tag">{item.tag}</span>
            <span className="testimonial-quote">{item.quote}</span>
            <span className="testimonial-author">{item.author}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
