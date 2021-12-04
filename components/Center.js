import { ChevronDownIcon, LogoutIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import { signOut } from 'next-auth/react';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [isActive, setActive] = useState('false');

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log('Something went wrong!', err));
  }, [spotifyApi, playlistId]);

  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide select-none relative">
      <header className="absolute top-5 right-8" onClick={handleToggle}>
        <div className="flex items-center bg-[#2e2e2e] space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full pr-2">
          <img
            className="rounded-full w-10 p-1 h-10"
            src={session?.user.image}
            alt="user image"
          />
          <h2 className="text-white">{session?.user.name}</h2>
          <ChevronDownIcon className="text-white h-5 w-5" />
        </div>
      </header>
      <div
        className={
          `h-10 w-52 rounded-sm bg-[#2e2e2e] text-white absolute right-8 top-[4.3rem] flex-col` +
          ' ' +
          `${isActive ? 'hidden' : 'flex'}`
        }
      >
        <div
          className="flex items-center justify-between cursor-pointer px-3 py-2"
          onClick={signOut}
        >
          <p className="hover:bg-[#2b2d30]">Log out</p>
          <LogoutIcon className="w-5 h-5" />
        </div>
      </div>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white pl-5 pb-5 border-[.5px]`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt="album image"
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
