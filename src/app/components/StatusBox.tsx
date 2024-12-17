import React from "react";
import { IconType } from "react-icons";

interface StatusBoxProps {
  count: number;
  label: string;
  Icon: IconType;
}

const StatusBox: React.FC<StatusBoxProps> = ({ count, label, Icon }) => (
  <div className="status-container w-1/4 bg-white h-40 rounded-lg border-2 border-violet-400">
    <div className="inside-box flex flex-row justify-center items-center space-x-5 mt-8">
      <div className="text text-violet-700 space-y-2">
        <h1 className="bus-op text-5xl font-bold">{count}</h1>
        <p className="text-lg">{label}</p>
      </div>
      <div>
        <Icon size={80} className="ml-2 cursor-pointer text-violet-400" />
      </div>
    </div>
  </div>
);

export default StatusBox;
