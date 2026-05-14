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
    <td><img src="https://github.com/user-attachments/assets/4d119459-2f32-448f-8e32-0a4d11b102c4"
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

Rather than erasing the baseline test, Kato et a;.'s approach of building on existing test capabilities is followed. According to the research paper, the researchers extendend MS test with a custom Report class to be able to report on performance in addition to functional test results. In a like manner, the following test are added to extended PetClinic's baseline JUnit suite which are Cypress E2E for Usability test and scenario coverage, JMeter APIs for performance efficiency and SonarQube static analysis for maintainability and reliability. This expands test coverage over more ISO/IEC 25010 quality characteristic rather than rewriting the existing ones.  

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
| Static analysis |  | SonarQube | Provides concerte tool for maintainability mapping |
| Test result storage | Custom C# tool and SQL Server | Jenkins build history and native plugins | Lighter weight |
| Deployment | Abstract | Digital Ocean | Installability |


### 3. Implementing DevOps Practices
Here is how this methodology translates into the actual project workflow:

* **CI/CD Pipeline:** **Jenkins** is configured to automatically trigger builds and tests whenever code is pushed.
* **Build Stage:** Jenkins pulls the latest code and compiles the project. A successful build is the baseline — if it fails, nothing else runs.
* **Unit Testing (VS Code + JUnit):** Developers write and run unit tests locally in **VS Code** using the **JUnit** framework to verify Functional Suitability by checking that individual functions behave correctly.
* **Static Analysis (SonarQube):** Coding standards and common defects are checked to support reliability and maintainability.
* **API Testing (JMeter):** Runs next to verify performance efficiency. JMeter captures response times, throughput, and resource usage to make sure the system performs within acceptable thresholds.
* **E2E Testing (Cypress):** Runs last as the top of the pyramid. Cypress executes scenario-based tests that simulate real user interactions, covering functional suitability and usability.
* **Deployment:** Once all tests pass, the pipeline automatically deploys the application to a **Digital Ocean** droplet so the project is live. 

--- 

### Quality Characteristic Mapping
Following the paper's approach, each pipeline stage is explicitly mapped to the quality characteristics it verifies:

| Pipeline Stage | Quality Characteristic | Sub-characteristics |
|---|---|---|
| Coding Rules | Maintainability | Modularity, Modifiability, Testability |
| Static Analysis (SonarQube) | Reliability, Maintainability | Maturity, Analysability |
| Unit Test | Functional Suitability | Completeness, Correctness |
| API Test (JMeter) | Performance Efficiency | Time Behaviour, Resource Utilization |
| E2E Test (Cypress) | Functional Suitability, Usability | Appropriateness, Operability, User Error Protection|
| Pipeline Processing Time | Performance Efficiency | Time Behaviour |
| Deployment | Digital Ocean | Portability | Installability |

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
| Static analysis issue | SonarQube dashboard | Maintainability, Reliability |
| API response time and throughput | JMeter test results | Performance Efficiency |
| E2E test pass/fail rate | Cypress test reports in Jenkins | Functional Suitability, Usability |
| Bug count per sprint | Manual tracking via issue tracker | Reliability |
| Test density (tests per feature) | Calculated from test reports | Overall test coverage |
| Pipeline processing time | Jenkins build duration logs | Performance Efficiency |
| Deployment success rate | Jenkins deployment stage logs | Portability |

## Implementation (DevOps pipeline)

## Results & Analysis

## Comparison with paper

## Conclusion

## Presentation (max 15 minutes including product demo)
Example: show your implemented tool, metric dashboard, or test results.

## References (Not less than 20)

