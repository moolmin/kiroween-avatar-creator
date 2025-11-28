/**
 * RandomButton Component
 * 
 * Button that triggers random avatar generation. Connects to the randomize()
 * action from the avatar store to generate a completely random avatar
 * configuration.
 * 
 * Requirements: 8.1, 8.2, 8.3
 */

import { useAvatarStore } from '@/lib/avatarStore';

export default function RandomButton() {
  const randomize = useAvatarStore((state) => state.randomize);

  return (
    <button
      onClick={randomize}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
      aria-label="Generate random avatar"
    >
      {/* Shuffle/Dice Icon */}
      <svg
        className="w-5 h-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
          clipRule="evenodd"
        />
      </svg>
      <span>Randomize</span>
    </button>
  );
}
