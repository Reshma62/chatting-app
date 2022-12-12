import React from 'react'
import {FiSearch} from "react-icons/fi"
import { BsThreeDotsVertical } from "react-icons/bs";
const Search = () => {
  return (
    <div className="relative ">
      <input
        className="w-full py-5 pl-20 outline-none shadow-xl rounded-xl"
        type="text"
        placeholder="Search here"
      />
      <FiSearch className="absolute left-5 text-2xl top-5 " />
      <BsThreeDotsVertical className="absolute right-5 text-2xl top-5 text-primary" />
    </div>
  );
}

export default Search