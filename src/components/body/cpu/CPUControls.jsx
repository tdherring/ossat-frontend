import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faPlay, faStepBackward, faStepForward, faFastBackward, faFastForward, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CPUSimulatorContext } from "../../../contexts/CPUSimulatorContext";
import { ResizeContext } from "../../../contexts/ResizeContext";
import { ModalContext } from "../../../contexts/ModalContext";
import AddProcess from "../../modals/AddProcess";
import FCFS from "../../../simulator/cpu/non_preemptive/fcfs.mjs";
import SJF from "../../../simulator/cpu/non_preemptive/sjf.mjs";
import Priority from "../../../simulator/cpu/non_preemptive/priority.mjs";
import RR from "../../../simulator/cpu/preemptive/rr.mjs";
import SRTF from "../../../simulator/cpu/preemptive/srtf.mjs";

const CPUControls = () => {
  const [, setActiveModal] = useContext(ModalContext);
  const [activeCPUScheduler, setActiveCPUScheduler] = useContext(CPUSimulatorContext).active;
  const [, setSimulationSpeed] = useContext(CPUSimulatorContext).speed;
  const [widthValue] = useContext(ResizeContext).width;
  const [running, setRunning] = useContext(CPUSimulatorContext).running;
  const [timeDelta, setTimeDelta] = useContext(CPUSimulatorContext).time;
  const [jobQueue] = useContext(CPUSimulatorContext).jQueue;

  const Scheduler = { FCFS: new FCFS(), SJF: new SJF(), Priority: new Priority(), RR: new RR(2), SRTF: new SRTF() };

  const [activeSchedulerName, setActiveSchedulerName] = useState("First Come First Served (FCFS)");

  const dropdownOptions = [
    {
      label: "First Come First Served (FCFS)",
      value: "FCFS",
    },
    {
      label: "Shortest Job First (SJF)",
      value: "SJF",
    },
    {
      label: "Priority",
      value: "Priority",
    },
    {
      label: "Round Robin (RR)",
      value: "RR",
    },
    {
      label: "Shortest Remaining Time First (SRTF)",
      value: "SRTF",
    },
  ];

  let schedule = activeCPUScheduler.getSchedule();

  return (
    <div className={`field is-grouped is-grouped-multiline ${widthValue < 1115 && "is-grouped-centered"}`}>
      <span className="control">
        <div className="dropdown is-hoverable">
          <div className="dropdown-trigger">
            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" style={{ width: "20rem" }}>
              <span>{activeSchedulerName}</span>
              <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
            </button>
          </div>

          <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{ width: "20rem" }}>
            <div className="dropdown-content" value="FCFS">
              {dropdownOptions.map((option) => (
                <a
                  key={option.value}
                  href="/#"
                  className="dropdown-item"
                  value={option.value}
                  onClick={() => {
                    setActiveSchedulerName(option.label);
                    setActiveCPUScheduler(Scheduler[option.value]);
                  }}
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </span>
      <span className="control">
        <input
          className="input"
          style={{ width: "4.5rem" }}
          type="number"
          defaultValue="1"
          min="0.1"
          max="10"
          step="0.1"
          onChange={(event) => {
            setSimulationSpeed(event.target.valueAsNumber);
          }}
        />
      </span>
      <span className="control buttons is-grouped has-addons">
        <button className="button is-primary" href="/#" onClick={() => setTimeDelta(0)}>
          <FontAwesomeIcon icon={faFastBackward} />
        </button>
        <button
          className="button is-primary"
          href="/#"
          onClick={() => {
            if (timeDelta > 0) setTimeDelta(timeDelta - 1);
          }}
        >
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button
          className="button is-primary"
          href="/#"
          onClick={() => {
            if (jobQueue.length > 0) {
              activeCPUScheduler.dispatchProcesses(true);
              setRunning(!running);
            }
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button
          className="button is-primary"
          href="/#"
          onClick={() => {
            if (timeDelta < schedule[schedule.length - 1].timeDelta + schedule[schedule.length - 1].burstTime) setTimeDelta(timeDelta + 1);
          }}
        >
          <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button
          className="button is-primary"
          href="/#"
          onClick={() => {
            if (timeDelta < schedule[schedule.length - 1].timeDelta + schedule[schedule.length - 1].burstTime)
              setTimeDelta(schedule[schedule.length - 1].timeDelta + schedule[schedule.length - 1].burstTime);
          }}
        >
          <FontAwesomeIcon icon={faFastForward} />
        </button>
      </span>
      <span className="control">
        <span className="field">
          <button
            className="button is-primary"
            href="/#"
            onClick={() => {
              setActiveModal("addProcess");
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Process
          </button>
        </span>
      </span>
      <AddProcess />
    </div>
  );
};

export default CPUControls;
