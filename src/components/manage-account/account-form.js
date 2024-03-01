"use client";
import { motion } from "framer-motion";

export default function AccountForm({
  formData,
  setFormData,
  showAccountForm,
  handleSave
}) {
  return (
    showAccountForm && (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="px-8 py-8 h-[270px] fixed top-[10px] gap-3 flex flex-col items-start right-[10px] rounded-xl bg-black opacity-[0.85] z-[999]">
          <div className="flex flex-col gap-5">
            <input
              type="text"
              name="name"
              value={formData["name"]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              placeholder="Enter Your Name"
              className="px-5 py-3 rounded-lg  placeholder:text-red-700 text-[#e5b109]  outline-none focus:outline-none"
            />
            <input
              type="password"
              name="pin"
              value={formData["pin"]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                })
              }
              maxLength={4}
              placeholder="Enter Your PIN"
              className="px-5 py-3 rounded-lg placeholder:text-red-700 text-[#e5b109] outline-none focus:outline-none"
            />
            <button
            onClick={handleSave}
             className="border p-4 bg-[#e7b204] hover:bg-[#ffc400] outline-none rounded-lg text-black text-lg font-bold">Save</button>
          </div>
        </div>
      </motion.div>
    )
  );
}
