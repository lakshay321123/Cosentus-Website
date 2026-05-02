import { Metadata } from 'next'
import PracticeManagementContent from './PracticeManagementContent'

export const metadata: Metadata = {
  title: 'Complete Practice Management Services | Cosentus',
  description: 'Beyond billing, front desk operations, credentialing, scheduling, financial counseling, and operational support so your clinical team focuses on patients.',
}

export default function PracticeManagementPage() {
  return (
    <main>
      <PracticeManagementContent />
    </main>
  )
}
