import { redirect } from 'next/navigation'

/* Launcher dashboard moved to / — redirect any bookmarks */
export default function MenuPage() {
  redirect('/')
}
