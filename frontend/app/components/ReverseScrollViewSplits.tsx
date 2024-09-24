import React, { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useKalpApi } from '@/app/hooks/useKalpApi';

const ReverseScrollViewSplits = (): React.ReactNode => {
    const { getCandidate, voteForCandidate, loading, error } = useKalpApi();

    const [candidates, setCandidates] = useState<{ [key: string]: number }>({
        "Narendra Modi": 0,
    });

    const fetchVotes = async () => {
        try {
            const data = await getCandidate("Narendra Modi");
            const kennedyVotes = data.result.result.votes;
            setCandidates(prevState => ({
                ...prevState,
                "Narendra Modi": kennedyVotes
            }));
        } catch (err) {
            console.error('Error fetching Modi votes:', err);
        }
    };

    const handleVote = async (candidateName: string) => {
        try {
            setLoadingState((prev) => ({ ...prev, [candidateName]: 'voting' })); // Set loading state for the candidate
            await voteForCandidate(candidateName);
            console.log(`Voted for ${candidateName}`);
            alert('Voting successful for candidate: Narendra Modi.');
            fetchVotes(); // Refresh vote count after voting
        } catch (err) {
            console.error('Vote error:', err);
            alert('Voting failed for candidate: Narendra Modi. Please try again.');
        } finally {
            setLoadingState((prev) => ({ ...prev, [candidateName]: null })); // Reset loading state
        }
    };

    useEffect(() => {
        fetchVotes(); // Fetch votes on page load
    }, []);

    const [loadingState, setLoadingState] = useState<{ [key: string]: 'voting' | null }>({});
    // console.log(candidates);

    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 1.2", "center 0.35"]
    });

    const rotate = useTransform(scrollYProgress, [0, 1], ["10deg", "0deg"]);
    const x = useTransform(scrollYProgress, [0, 1], ["-20rem", "0rem"]);
    const y = useTransform(scrollYProgress, [0, 1], ["-20rem", "0rem"]);

    return (
        <div ref={ref} className="w-full h-[50vh] flex justify-between items-center">
            <motion.div
                style={{ rotate, x }}
                className="bg-white transition-all duration-300 ease-out origin-bottom-left rounded-2xl h-full flex-[1.5]"
            >
                {/* Candidate image */}
                <img
                    src={"/images/modi-image.png"}
                    alt={"modi"}
                    className="h-full w-full object-cover rounded-2xl"
                />
            </motion.div>

            <motion.div
                style={{ y }}
                className="flex-1 text-white h-full"
            >
                <h1 className="text-[3rem] font-bold uppercase text-right">Narendra Modi</h1>
                <p className="font-normal text-right">Votes: {candidates["Narendra Modi"]}</p>
                <div className="w-full flex justify-end mt-5">
                    <button
                        onClick={() => handleVote("Narendra Modi")}
                        disabled={loadingState["Narendra Modi"] === 'voting'}
                        className="p-5 px-10 rounded-full border-[0.25px] border-white"
                    >
                        {loadingState["Narendra Modi"] === 'voting' ? "Loading..." : "Vote"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ReverseScrollViewSplits;
