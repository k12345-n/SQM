[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/NhtMdX3c)
## Requirements for Group Project (25%)
[Read the instruction](https://github.com/STTPK3123-A252/class-activity-sqm/blob/main/GroupProject.md)

## Group Info:
1. Matric Number & Name & Photo & Phone Number
1. Mention who the leader is.
1. Mention your previous group.
1. Other related info (if any)

<table>
  <tr>
    <td><b>No.</b></td>
    <td><b>Photo</b></td>
    <td><b>Name</b></td>
    <td><b>Matric Number</b></td>
    <td><b>Phone Number</b></td>
  </tr>
  <tr>
    <td>1</td>
    <td><img src="https://github.com/user-attachments/assets/9d3e6310-d902-41de-9b8e-ab46c8745712"
 width="160" height="240"></td>
    <td>Khor Ken Joo</td>
    <td>299843</td>
    <td>+6010-830 8896</td>
  </tr>
  <tr>
    <td>2</td>
    <td><img src="https://github.com/user-attachments/assets/546e2ff3-4e03-4a6d-ab3b-736ddd807f53" 
  width="160" height="240"></td>
    <td>Andrew Looi Szu Kit</td>
    <td>299412</td>
    <td>+6017-244 6292</td>
  </tr>
  <tr>
    <td>3</td>
    <td><img src="https://github.com/user-attachments/assets/72cd0f3f-be62-42ca-9b8b-b2d703635726"
 width="160" height="240"></td>
    <td>Eric Lee Shen Yi</td>
    <td>299300</td>
    <td>+6011-3671 6188</td>
  </tr>
  <tr>
    <td>4</td>
    <td><img src="https://github.com/user-attachments/assets/279c39d7-d6ac-42e5-bcb7-582b63d9e43d"
 width="160" height="240"></td>
    <td>Tan Hou Ren</td>
    <td>301235</td>
    <td>+6011-1322 7627</td>
  </tr>
</table>

## Title

## Introduction

## Related Work (selected article)
https://dl-acm-org.eserv.uum.edu.my/doi/10.1145/3508397.3564840 

## Methodology (from paper + adaptation)
### 1. Analysis of the Research Methodology
The paper follows an experimental methodology. The researchers ran two separate Agile projects side by side and compared their outcomes:

* Project 1 (Baseline): A standard Agile project where each sprint tried to cover all quality characteristics at once, but without any formal mapping rules or quality-based KPIs. This project ended up failing — tasks were delayed, and the results were heavily biased toward functional suitability while other quality areas were neglected.
  
* Project 2 (Enhanced): An Agile project where quality characteristics were formally declared in the project charter before development began. The team mapped every activity (design, coding, testing) to specific ISO/IEC 25010 quality characteristics and used those characteristics as KPIs to track progress sprint by sprint. This project reported a test density at 144% of baseline while finding only 32% of the predicted bug count.
  
The core steps were:
* 1. Define software quality goals using the ISO/IEC 25010 model *before* development starts.
  2. Build a CI/CD pipeline in Jenkins with multiple testing stages like unit tests, API tests, static analysis, and E2E tests.
  3. Map each automated test in the CI/CD pipeline to a specific quality goal. For example, mapping unit tests to "Functional Suitability".
  4. Continuously tracking test results and comparing outcomes between the two projects to measure the impact of using quality characteristics as KPIs.

For the tool stack, Jenkins served as the CI server. The automated testing included Visual Studio for static analysis and unit testing, JMeter for API performance tests, and Ranorex for End-to-End (E2E) scenario testing. The metrics tracked mainly included test pass rates, bug rates, and processing time.

<!-- FIGURE 1: ISO/IEC 25010 Quality Model (from paper, Figure 1) -->
<img width="1204" height="527" alt="ISO/IEC 25010 Quality Model" src="https://github.com/user-attachments/assets/aefdb9c7-31d2-4cd1-b2a7-3493fc8f3ac3" />
Figure 1: ISO/IEC 25010 Quality Model for System/Software Product quality (source: Kato et al., 2022).

---
The Spring PetClinic application is selected as the System Under Test. It is selected as it is an open-source Spring Boot application featuring a web UI, REST endpoints, JPA-based persistence, and an existing JUnit test suite covering the service and repository layer. This app is chosen given its realistic multi-layer architecture applicable for the demonstration of the full pyramid of test as well as the pre-existing test suite to act as Functional Suitability coverage baseline. 

Rather than erasing the baseline test, Kato et al.'s approach of building on existing test capabilities is followed. According to the research paper, the researchers extended MS test with a custom Report class to be able to report on performance in addition to functional test results. In a like manner, the following test are added to extended PetClinic's baseline JUnit suite which are Cypress E2E for Usability test and scenario coverage, JMeter APIs for performance efficiency. This expands test coverage over more ISO/IEC 25010 quality characteristic rather than rewriting the existing ones.  

---
### 2. Adaptation of the Methodology
The same experimental approach is followed as in the paper which are before/after comparison. The development process is run firstly without applying quality characteristic mapping, and then introducing the quality-based KPI framework to see what difference it makes.

* **Reused Components:**
  * **The Quality Mapping:** Pipeline stages are still linked to specific quality sub-characteristics.
  * **API Testing:** Just like the paper, **JMeter** is used to track performance data and ensure the system doesn't slow down between builds.
  * **Jenkins as the CI Server:** **Jenkins** is used to keep the CI setup consistent with the original research and avoids introducing unnecessary differences.
  *  **The Test Pyramid Approach:** Like the paper, the tests are structured in a pyramid — unit tests at the base (fast, many), API tests in the middle, and E2E tests at the top (slower, fewer).

<!-- FIGURE 2: Test Pyramid (from paper, Figure 7) -->
<img width="504" height="396" alt="Test Pyramid" src="https://github.com/user-attachments/assets/d4e0aac6-d02f-42aa-8ec1-978543ffab3f" />

*Figure 2: Test Pyramid (source: Kato et al., 2022, adapted from Mike Cohn).*

#### Modified Components

| Component | Research Paper use tools | Adaption tools | Justification |
|---|---|---|---|
| IDE and Unit test framework | Visual Studio and MS test | VS code and JUnit | Cross-platform and aligns with Java|
| E2E  test tool | Ranorex | Cypress | Open sources, web native and JS based |
| API/ Performance test | JMeter | JMeter | Retained |
| CI server | Jenkins | Jenkins | Retained |
| Test result storage | Custom C# tool and SQL Server | Jenkins build history and native plugins | Lighter weight |
| Deployment | Abstract | Docker | Containerization produces a self-contained, portable artifact that proves Portability and Installability |


### 3. Implementing DevOps Practices
Here is how this methodology translates into the actual project workflow:

* **CI/CD Pipeline:** **Jenkins** is configured to automatically trigger builds and tests whenever code is pushed.
* **Build Stage:** Jenkins pulls the latest code and compiles the project. A successful build is the baseline — if it fails, nothing else runs.
* **Unit Testing (VS Code + JUnit):** Developers write and run unit tests locally in **VS Code** using the **JUnit** framework to verify Functional Suitability by checking that individual functions behave correctly.
* **API Testing (JMeter):** Runs next to verify performance efficiency. JMeter captures response times, throughput, and resource usage to make sure the system performs within acceptable thresholds.
* **E2E Testing (Cypress):** Runs last as the top of the pyramid. Cypress executes scenario-based tests that simulate real user interactions, covering functional suitability and usability.
* **Deployment:** Once all tests pass, Jenkins builds a Docker image of the application using the project's Dockerfile. This produces a portable, self-contained deployment artifact that can be installed and run on any Docker-compatible environment without manual configuration. This fulfills the portability and installability quality characteristic under ISO/IEC 25010 without requiring a paid cloud platform.

--- 

### Quality Characteristic Mapping
Following the paper's approach, each pipeline stage is explicitly mapped to the quality characteristics it verifies:

| Pipeline Stage | Quality Characteristic | Sub-characteristics |
|---|---|---|
| Coding Rules | Maintainability | Modularity, Modifiability, Testability |
| Unit Test (JUnit) | Functional Suitability | Completeness, Correctness |
| API Test (JMeter) | Performance Efficiency | Time Behaviour, Resource Utilization |
| E2E Test (Cypress) | Functional Suitability, Usability | Appropriateness, Operability, User Error Protection|
| Pipeline Processing Time | Performance Efficiency | Time Behaviour |
| Deployment (Docker) | Portability | Installability, Adaptability |

---

### Before/After Comparison Design

To replicate the paper's experimental approach:

- **Phase 1 (Without Quality KPIs):** Several sprints is run using a standard approach — tests exist in the pipeline, but there is no formal mapping to quality characteristics and no quality-based KPIs guiding our work.
- **Phase 2 (With Quality KPIs):** Quality characteristic mapping is introduce, quality goals are declare in the project plan, and use quality characteristics as KPIs to guide each sprint. The outcomes are compared for both phases.

---

### 4. Data Collection

To validate our pipeline and compare our results with the paper's findings, we collect the following data across both phases:
 
| Metric | How It Is Collected | Maps To |
|---|---|---|
| Build success/failure rate | Jenkins build logs | Overall pipeline health |
| Unit test pass/fail rate | JUnit reports published in Jenkins | Functional Suitability |
| Code coverage | JaCoCo reports published in Jenkins | Functional Suitability |
| API response time and throughput | JMeter test results | Performance Efficiency |
| E2E test pass/fail rate | Cypress test reports in Jenkins | Functional Suitability, Usability |
| Bug count per sprint | Manual tracking via issue tracker | Reliability |
| Test density (tests per feature) | Calculated from test reports | Overall test coverage |
| Pipeline processing time | Jenkins build duration logs | Performance Efficiency |
| Docker image build success rate | Jenkins deployment stage logs | Portability, Installability |

## Implementation (DevOps pipeline)
## 1. Automated Pipeline Overview
This repository utilizes a comprehensive Continuous Integration and Continuous Testing (CI/CT) workflow managed via **Jenkins**. The pipeline enforces software quality gates at every phase of the development lifecycle, ensuring that codebase modifications are verified before deployment.

### Monorepo System Architecture
To facilitate unified pipeline execution, an **Integrated Monorepo** pattern was established at the repository root:
* `pom.xml` & `src/main/` - Core Java Spring Boot application (System Under Test).
* `cypress/` - Automated End-to-End (E2E) UI test suites.
* `src/test/jmeter/` - JMeter performance testing test plans (`.jmx`).
* `Jenkinsfile` - Main declarative configuration pipeline script.
* `docker-compose.yml` & `Dockerfile` - Environment orchestrator and image build.

---

## 2. Pipeline Stages & Quality Gates

The pipeline runs sequentially through six core stages to ensure software stability:

```text
[SCM Checkout] ──> [Build & Compile] ──> [Unit Test (JUnit + JaCoCo)] ──> [Cypress E2E] ──> [JMeter Performance] ──> [Deploy (Docker)]
```

i. Source Code Management (SCM): Automatically pulls the latest commit from the official groupproject-habibi main branch.

ii. Build & Compile: Executes mvn clean package -DskipTests to compile the Java Spring Boot source code and bundle dependencies into an executable JAR file.

iii. Unit Testing (JUnit + JaCoCo): Executes `mvn test` to run the JUnit unit suite and publishes a JaCoCo code-coverage report, verifying Functional Suitability at the base of the test pyramid.

iv. End-to-End Testing (Cypress): Boots the Spring Boot application on port 8081 and waits for its health endpoint, then runs 92 distinct test cases across 8 automated specifications to validate critical user flows (e.g., Owner management, Pet registration, Security checks).

v. Performance Testing (JMeter): Executes high-concurrency stress test plans (petclinic_improved.jmx and petclinic_test_plan.jmx) via CLI to gather latency and error-rate metrics.

vi. Deployment (Docker Compose): Builds the application Docker image and launches the container via `docker-compose`, then verifies the deployed app responds on port 8081 — fulfilling the Portability and Installability quality characteristics.

## 3. Pipeline Execution Status

CI Pipeline Script: Standardized onto a single, strictly typed declarative Jenkinsfile.

Post-Build Actions: Configured automated parsing hooks via Jenkins (junit and perfReport) to convert generated .jtl data logs into visual performance trend graphs on the dashboard.



## Results & Analysis

The implementation of the DevOps CI/CD pipeline across two distinct experimental phases yielded substantial empirical data regarding the impact of quality-driven Key Performance Indicators (KPIs). By systematically gathering metrics through Jenkins, JaCoCo, Cypress, and JMeter, the following observations were made:

### 1. Test Density and The Testing Pyramid
In Phase 1, the pipeline relied exclusively on a baseline of 57 JUnit unit tests. While these executed quickly, they only provided narrow coverage of the backend service layers. In Phase 2, explicitly targeting **Usability** and **Functional Suitability** (per the ISO/IEC 25010 model) drove the team to expand the Test Pyramid by adding 92 Cypress End-to-End (E2E) tests. This resulted in a total test density of 149 tests—a massive **161% increase**. This shift transformed the pipeline from a simple integration check into a comprehensive behavioral validation system.

### 2. Defect Detection and Automated Quality Gates
The most critical finding of this project is the stark divergence in build status and defect visibility between the two phases:
* **The Phase 1 False Positive:** The baseline pipeline achieved a 100% unit test pass rate and a green `SUCCESS` build status. However, this provided a false sense of security; the unit tests successfully validated the Java backend but completely ignored the HTML/JS frontend interactions.
* **The Phase 2 Quality Gate:** The introduction of Cypress E2E testing immediately exposed 4 critical defects in the application's form submission logic (specifically validation failures in the `Pets` and `Visits` modules, such as accepting invalid date formats). 

Following a developer patching cycle, the defect count was halved, resulting in a **97.83% E2E pass rate** (90 out of 92 tests passing). Crucially, the Jenkins CI/CD pipeline correctly maintained a `FAILED` build status. This demonstrates a strict, highly reliable DevOps quality gate: the automated pipeline physically prevented the deployment of defective code to the production environment, proving that DevOps practices actively intercept bugs before they reach end-users.

### 3. Performance Efficiency Under Sustained Load
API response times, measured via JMeter, showed an increase from an average of 4,993 ms in Phase 1 to 8,037 ms in Phase 2. While a surface-level analysis might interpret this as performance degradation, the data actually reflects a vastly more rigorous and realistic stress-testing environment. 
* Phase 1 simulated basic `GET` requests across 13 endpoints. 
* Phase 2 expanded the scope to 16 endpoints and introduced heavy database write operations (e.g., `POST new owner`), mimicking real-world concurrent usage. 

Despite handling **80,000 simulated requests** under this heavier data-write load, the system maintained a **0.00% error rate**. This confirms the system's robust Reliability and Performance Efficiency, proving the architecture can handle sustained stress without service interruption.

### 4. Unit Test Coverage Stagnation
An unexpected but vital finding was the stagnation of internal coverage metrics. Across both phases, JaCoCo Test Coverage remained entirely static at 91.90%. 
* **The limit of Dynamic Testing:** This highlights a fundamental reality of DevOps engineering. Expanding external dynamic black-box testing (Cypress and JMeter) does not artificially inflate internal code coverage metrics. 
* **Tool Blindspots:** Furthermore, JaCoCo exclusively monitors Java bytecode execution during JUnit testing and is fundamentally blind to external JavaScript-based browser testing. Therefore, while our *actual* functional coverage expanded massively through Cypress, our internal structural metrics remained static.

---

## Comparison with Kato et al. (2022)

Our findings strongly align with the core thesis presented by Kato et al. (2022), demonstrating that explicitly managing software development through defined quality characteristics natively improves software reliability. 

### Key Similarities
* **Intentional Metric Scaling:** The original Kato et al. experiment observed a test density increase to 144% of their baseline when implementing quality-driven KPIs. Our adapted methodology successfully mirrored and exceeded this success, achieving a **161% increase** in test density by integrating UI and Performance testing layers based explicitly on ISO/IEC 25010 goals.
* **Reduction of Escaped Defects:** The referenced paper noted that focusing on specific quality characteristics reduced the number of unpredicted bugs escaping into production by 68%. Similarly, our Phase 1 baseline completely missed 4 critical defects that were immediately caught in Phase 2 once *Usability* and *Appropriateness* were formally mapped to our testing stages.

### Divergence and Methodological Adaptations

While both our project and the Kato et al. study successfully utilized **Jenkins** as the core Continuous Integration orchestrator, our specific implementation diverged in project management enforcement and metric aggregation to better suit a modern web stack:

* **Pipeline Quality Gates vs. Agile Managerial Tracking:** The original study managed its quality characteristics by manually adding items to Jira and visually tracking conformance sprint-by-sprint on a Kanban board. To adapt this for a stricter DevOps environment, we shifted this responsibility from the project manager to the CI/CD pipeline itself. Instead of just visualizing progress, our pipeline acts as an uncompromising automated enforcer, physically blocking deployments (Build `FAILED`) when End-to-End functional metrics drop below 100%.
* **Metric Aggregation (Custom Code vs. Distributed Plugins):** To track their KPIs, the original researchers had to develop a custom C# tool backed by an SQL Server, utilizing a custom `Report` class to merge functional and performance XML data into a single HTML view. Rather than writing custom reporting software, we utilized a "best-of-breed" distributed approach. Our metrics were deliberately siloed across specialized tools (JaCoCo for Unit Coverage, Cypress for UI validation, JMeter for Performance metrics). While this provided deeper, highly specialized insights for each ISO/IEC 25010 characteristic, it required us to rely on native Jenkins plugins (`junit` and `perfReport`) to aggregate the final quality picture directly on the Jenkins dashboard.

---


## Conclusion

This project successfully demonstrated the practical value of integrating ISO/IEC 25010 quality characteristics as measurable KPIs within a DevOps CI/CD pipeline, replicating and adapting the experimental methodology proposed by Kato et al. (2022) using the Spring PetClinic application as the System Under Test.

The two-phase experimental approach revealed a critical insight: a pipeline that appears healthy on the surface can mask serious defects. In Phase 1, the baseline pipeline reported a 100% unit test pass rate and a green build status, yet completely failed to detect four critical defects in the application's frontend form validation logic. This false sense of security is precisely the problem that quality-driven KPIs are designed to solve.

By formally mapping each pipeline stage to specific ISO/IEC 25010 quality characteristics in Phase 2 — adding Cypress E2E tests for Functional Suitability and Usability, and JMeter stress tests for Performance Efficiency — the team achieved a 161% increase in test density, surpassing the 144% benchmark reported in the original paper. The four previously hidden defects were immediately caught and the pipeline enforced a FAILED build status, physically preventing defective code from reaching the production environment.

Performance testing further confirmed the system's robustness, sustaining 80,000 simulated requests across 16 endpoints with a 0.00% error rate. An additional finding highlighted the limitation of relying on a single metric: JaCoCo code coverage remained static at 91.90% across both phases, demonstrating that internal structural metrics are blind to external black-box testing tools such as Cypress — reinforcing the need for a multi-tool measurement strategy.

In conclusion, the results strongly validate the core thesis of Kato et al. (2022): explicitly defining and tracking software quality characteristics transforms a CI/CD pipeline from a simple build checker into an active, automated quality enforcer. The shift from reactive bug fixing to proactive quality gating is not only achievable but measurably effective, and represents a best practice for modern software engineering teams adopting DevOps principles.

## Presentation (max 15 minutes including product demo)
Example: show your implemented tool, metric dashboard, or test results.

## References

1. Kato, D., Shimizu, A., & Ishikawa, H. (2022). Quality classification for testing work in DevOps. In *Proceedings of the 14th International Conference on Management of Digital EcoSystems (MEDES '22)* (pp. 156–162). Association for Computing Machinery. https://doi.org/10.1145/3508397.3564840
2. International Organization for Standardization. (2023). *ISO/IEC 25010:2023 Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model.* https://www.iso.org/standard/78176.html
3. Cohn, M. (2009). *Succeeding with agile: Software development using Scrum.* Addison-Wesley.
4. Spring Team. (n.d.). *Spring PetClinic sample application* [Computer software]. GitHub. Retrieved May 22, 2026, from https://github.com/spring-projects/spring-petclinic
5. Jenkins Project. (n.d.). *Jenkins user documentation.* Retrieved May 22, 2026, from https://www.jenkins.io/doc/
6. Cypress.io. (n.d.). *Cypress documentation.* Retrieved May 22, 2026, from https://docs.cypress.io/
7. Apache Software Foundation. (n.d.). *Apache JMeter user's manual.* Retrieved May 22, 2026, from https://jmeter.apache.org/usermanual/
