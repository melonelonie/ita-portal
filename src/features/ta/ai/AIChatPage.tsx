import { Bot } from 'lucide-react';
import ComingSoon from '../../../components/shared/ComingSoon';

export default function AIChatPage() {
  return (
    <ComingSoon
      title="AI Recruitment Assistant"
      description="This module will provide a conversational AI interface powered by LLM agents for recruitment workflows. Currently awaiting backend API and Claude integration."
      icon={Bot}
      details={[
        'Natural language queries about candidates and pipelines',
        'AI-assisted JR drafting from brief descriptions',
        'Automated CV screening and candidate scoring',
        'Pipeline stall detection and proactive alerts',
        'Natural language report generation with export',
      ]}
    />
  );
}
