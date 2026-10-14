import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition title="Wrong universe | Suhas Choudary">
      <section className="mx-auto flex min-h-[80dvh] max-w-7xl flex-col justify-center px-4 pt-24 md:px-8">
        <p className="sfx relative z-10 inline-block self-start text-5xl" style={{ rotate: '-6deg' }}>
          404!
        </p>
        <h1 className="glitch font-display misprint mt-8 text-7xl md:text-9xl" data-text="Wrong universe">
          Wrong universe
        </h1>
        <p className="mt-6 max-w-[42ch] text-xl text-paper/90">
          This page got pulled into another dimension. The canon event you were looking for does not happen here.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn btn-hero sense">
            Swing home <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
