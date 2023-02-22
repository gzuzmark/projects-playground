import { useEffect, useState } from "react";

function useChannels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    async function getChannels() {
      const channels = await fetch("http://localhost:4000/channels");
      const result = await channels.json();

      // Convert json object to array removing the key and just takin the value
      const channelsArray = Object.values(result);

      setChannels(channelsArray);
    }
    getChannels();
  }, []);

  return channels;
}

export { useChannels };
