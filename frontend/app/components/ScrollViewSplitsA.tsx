import React, { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useKalpApi } from '@/app/hooks/useKalpApi';

const ScrollViewSplitsA = (): React.ReactNode => {
  const { getCandidate, voteForCandidate, loading, error } = useKalpApi();

  const [candidates, setCandidates] = useState<{ [key: string]: number }>({
    "Donald Trump": 0
  });

  const fetchVotes = async () => {
    try {
      const data = await getCandidate("Donald Trump");
      const trumpVotes = data.result.result.votes;
      setCandidates(prevState => ({
        ...prevState,
        "Donald Trump": trumpVotes
      }));
    } catch (err) {
      console.error('Error fetching Trump votes:', err);
    }
  };

  const handleVote = async (candidateName: string) => {
    try {
      setLoadingState((prev) => ({ ...prev, [candidateName]: 'voting' })); // Set loading state for the candidate
      await voteForCandidate(candidateName);
      console.log(`Voted for ${candidateName}`);
      alert('Voting successful for candidate: Donald Trump.');
      fetchVotes(); // Refresh vote count after voting
    } catch (err) {
      console.error('Vote error:', err);
      alert('Voting failed for candidate: Donald Trump. Please try again.');
    } finally {
      setLoadingState((prev) => ({ ...prev, [candidateName]: null })); // Reset loading state 
    }
  }
  useEffect(() => {
    fetchVotes(); // Fetch votes on page load
  }, []);

  const [loadingState, setLoadingState] = useState<{ [key: string]: 'voting' | null }>({});

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 1.2", "center 0.3"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], ["10deg", "0deg"]);
  const x = useTransform(scrollYProgress, [0, 1], ["20rem", "0rem"]);
  const y = useTransform(scrollYProgress, [0, 1], ["20rem", "0rem"]);

  return (
    <div ref={ref} className="w-full h-[50vh] flex justify-between items-center">
      <motion.div style={{ y }} className="flex-1 h-full">
        <h1 className="text-[3rem] font-bold uppercase text-left">Donald Trump</h1>
        <p className="font-normal text-left">Votes: {candidates["Donald Trump"]}</p>
        <div className="w-full flex justify-start mt-5">
          <button
            onClick={() => handleVote("Donald Trump")}
            disabled={loadingState["Donald Trump"] === 'voting'}
            className="p-5 px-10 rounded-full border-[0.25px] border-white"
          >
            {loadingState["Donald Trump"] === 'voting' ? "Loading..." : "Vote"}
          </button>
        </div>
      </motion.div>

      <motion.div style={{ rotate, x }} className="bg-white transition-all duration-300 ease-out origin-bottom-right rounded-2xl h-full flex-[1.5] flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
          <img src={"/images/trump-image.png"} alt="trump" className="w-full h-full object-cover rounded-2xl" />
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollViewSplitsA;
