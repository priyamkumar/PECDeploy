import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Input } from '../ui/input';
import { useFeeds } from '../../context/FeedContext';
import { Plus, Rss, Folder, AlertCircle, Sparkles } from 'lucide-react';

export interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_FEEDS = [
  { url: 'https://overreacted.io/rss.xml', title: 'Overreacted (Dan Abramov)', folder: 'Engineering & AI' },
  { url: 'https://simonwillison.net/atom/entries/', title: 'Simon Willison’s Weblog', folder: 'Engineering & AI' },
  { url: 'https://news.ycombinator.com/rss', title: 'Hacker News Frontpage', folder: 'Tech Journalism' },
  { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', folder: 'Tech Journalism' },
  { url: 'https://lwn.net/headlines/rss', title: 'LWN.net Linux Community', folder: 'Systems & Open Source' },
];

export const AddFeedModal: React.FC<AddFeedModalProps> = ({ isOpen, onClose }) => {
  const { addNewFeed, folders } = useFeeds();
  const [url, setUrl] = useState('');
  const [folder, setFolder] = useState('Engineering & AI');
  const [customFolder, setCustomFolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    const targetFolder = customFolder.trim() || folder || 'General';

    try {
      await addNewFeed(url.trim(), targetFolder);
      setUrl('');
      setCustomFolder('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to discover or parse feed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (presetUrl: string, presetFolder: string) => {
    setUrl(presetUrl);
    setFolder(presetFolder);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-sepia dark:text-gold" />
          <span className="font-headline font-bold text-ink dark:text-white">Subscribe to New Dispatch</span>
        </div>
      }
      description="Enter a website URL or direct RSS/Atom XML link. IncogniRead will autodiscover the feed and parse it safely in your browser."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-mono">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-sepia dark:text-gold mb-1.5">
            Publication or Feed URL
          </label>
          <Input
            type="text"
            placeholder="e.g. overreacted.io or https://example.com/feed"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            icon={<Rss className="h-4 w-4 text-sepia dark:text-gold" />}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-kicker font-semibold uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] mb-1.5">
              Department Folder
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full h-11 min-h-[44px] rounded-xl border border-[#D5CFBE] dark:border-[#2A2E35] bg-white dark:bg-[#141619] text-xs font-mono tabular-nums font-medium text-[#0A0A0A] dark:text-[#F5F5F0] px-3 focus:outline-none focus:border-[#0A0A0A] dark:focus:border-[#E6AF2E]"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name}
                </option>
              ))}
              <option value="New Folder">+ Create New Department...</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-kicker font-semibold uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] mb-1.5">
              Custom Department Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Machine Learning"
              value={customFolder}
              onChange={(e) => setCustomFolder(e.target.value)}
              icon={<Folder className="h-4 w-4 text-[#B45309] dark:text-[#E6AF2E]" />}
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2 pt-2 border-t border-[#D5CFBE]/60 dark:border-[#2A2E35]">
          <span className="text-[11px] font-kicker font-semibold uppercase tracking-[0.12em] text-[#B45309] dark:text-[#E6AF2E] flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Recommended Starter Dispatches:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_FEEDS.map((preset) => (
              <button
                type="button"
                key={preset.url}
                onClick={() => handleSelectPreset(preset.url, preset.folder)}
                className="btn-press-3d px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-[#ECE8DF] dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px] text-[#0A0A0A] dark:text-[#F5F5F0] hover:text-[#B45309] dark:hover:text-[#E6AF2E] transition-colors"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="btn-press-3d px-4 py-2 rounded-xl text-xs font-mono font-medium tabular-nums text-[#0A0A0A] dark:text-[#F5F5F0] bg-white dark:bg-[#1D2025] border border-[#D5CFBE] dark:border-[#2A2E35] border-b-[3px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-press-3d flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0A0A0A] dark:bg-[#E6AF2E] text-white dark:text-[#0B0C0E] font-bold text-xs uppercase tracking-wider border-b-[3px] border-b-black/80 dark:border-b-[#C5911B] hover:bg-[#262626] dark:hover:bg-[#F3C760] transition-all disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>{isLoading ? 'Parsing Dispatch...' : 'Discover & Subscribe'}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
};
