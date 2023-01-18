import React from "react"
import clsx from "clsx"
import { VscSymbolVariable } from "react-icons/vsc"
import { BsPauseCircle, BsRecycle, BsServer, BsTree } from "react-icons/bs"
import { SiJavascript, SiTypescript } from "react-icons/si"
import { CgListTree } from "react-icons/cg"
import { BiSkipNextCircle } from "react-icons/bi"
import { MdCached } from "react-icons/md"

import styles from "./styles.module.css"
import { useWindowSize } from "react-kuh"

const FeatureList = [
  {
    title: "Declarative",
    icon: VscSymbolVariable,
  },
  {
    title: "Reusable",
    icon: BsRecycle,
  },
  {
    title: (
      <span>
        <code>fetch</code>-like API
      </span>
    ),
    icon: SiJavascript,
  },
  {
    title: "Request deduplication",
    icon: CgListTree,
  },
  {
    title: "Cache",
    icon: MdCached,
  },
  {
    title: "SSR ready",
    icon: BsServer,
  },
  {
    title: "TypeScript ready",
    icon: SiTypescript,
  },
  {
    title: "Suspense",
    icon: BsPauseCircle,
  },
  {
    title: "Pagination",
    icon: BiSkipNextCircle,
  },
]

function Feature({ title, icon: Icon }) {
  const windowSize = useWindowSize()
  return (
    <div
      className={clsx("col--2", {
        col: windowSize.width < 700,
      })}
    >
      <div
        className="text--center padding-horiz--md"
        style={{
          padding: "16px 0px",
        }}
      >
        <span
          style={{
            fontSize: "24px",
          }}
        >
          <Icon />
        </span>
        <h4>{title}</h4>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="row"
          style={{
            gap: "16px",
          }}
        >
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
