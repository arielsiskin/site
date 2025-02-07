import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Banner from "@/components/Banner/Banner.component";
import { PolicyText } from "@/components/Policy/PolicyText";

const Policy = () => {
  return (
    <div>
      <AnimatePresence>
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="p-20">
            <PolicyText />
          </motion.div>

          <Banner />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Policy;
