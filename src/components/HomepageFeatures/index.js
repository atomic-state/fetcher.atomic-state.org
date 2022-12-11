import React from "react"
import clsx from "clsx"
import { VscSymbolVariable } from "react-icons/vsc"
import { BsRecycle, BsServer } from "react-icons/bs"
import { SiTypescript } from "react-icons/si"

import styles from "./styles.module.css"

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
    title: "SSR ready",
    icon: BsServer,
  },
  {
    title: "TypeScript ready",
    icon: SiTypescript,
  },
]

function Feature({ title, icon: Icon }) {
  return (
    <div className={clsx("col col--3")}>
      <div
        className="text--center padding-horiz--md"
        style={{
          padding: "16px 0px",
        }}
      >
        <span
          style={{
            fontSize: "30px",
          }}
        >
          <Icon />
        </span>
        <h3>{title}</h3>
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
