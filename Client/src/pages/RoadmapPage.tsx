import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ProgressBar from "../components/ProgressBar";
import { isAuthenticated } from "../utils/auth";
import {
  generateRoadmap,
  getRoadmapById,
  regenerateRoadmap,
  updateRoadmapProgress,
} from "../utils/roadmap";
import type {
  DifficultyLevel,
  ProgressStatus,
  RoadmapDocument,
  RoadmapSourceProject,
} from "../utils/roadmap";

import "./Roadmappage.css";

interface GenerationLocationState {
  project?: RoadmapSourceProject;
  skills?: string[];
  experienceLevel?: DifficultyLevel;
}

const STATUS_LABEL: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

const STATUS_ORDER: ProgressStatus[] = ["not_started", "in_progress", "completed"];

function nextStatus(current: ProgressStatus): ProgressStatus {
  const index = STATUS_ORDER.indexOf(current);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

interface SectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

function Section({ title, subtitle, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="roadmap-section">
      <button
        type="button"
        className="roadmap-section-header"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="roadmap-section-title-group">
          <span className="roadmap-section-title">{title}</span>
          {subtitle && <span className="roadmap-section-subtitle">{subtitle}</span>}
        </span>
        <span className={`roadmap-chevron${open ? " roadmap-chevron-open" : ""}`} aria-hidden="true">
          ⌄
        </span>
      </button>

      {open && <div className="roadmap-section-body">{children}</div>}
    </div>
  );
}

function TagList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="roadmap-tag-list">
      {items.map((item) => (
        <span key={item} className="roadmap-tag">
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="roadmap-bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function RoadmapPage() {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const location = useLocation();

  const [roadmapDoc, setRoadmapDoc] = useState<RoadmapDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  // Tracks the id we've already loaded/generated so switching from
  // /roadmap -> /roadmap/:id (after generation) doesn't trigger a
  // redundant refetch.
  const loadedIdRef = useRef<string | null>(null);

  const locationState = location.state as GenerationLocationState | null;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const idFromUrl = params.id;

    if (idFromUrl && loadedIdRef.current === idFromUrl) {
      // Already have this roadmap loaded (e.g. we just navigated here
      // ourselves right after generating it).
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        if (idFromUrl) {
          const data = await getRoadmapById(idFromUrl);
          if (cancelled) return;
          loadedIdRef.current = idFromUrl;
          setRoadmapDoc(data.roadmap);
        } else if (locationState?.project && locationState?.skills && locationState?.experienceLevel) {
          const data = await generateRoadmap(
            locationState.project,
            locationState.skills,
            locationState.experienceLevel
          );
          if (cancelled) return;
          loadedIdRef.current = data.roadmap._id;
          setRoadmapDoc(data.roadmap);
          navigate(`/roadmap/${data.roadmap._id}`, { replace: true });
        } else {
          setRoadmapDoc(null);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any)?.response?.data?.error ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (err as any)?.response?.data?.message ||
          "We couldn't generate the roadmap. Please try again.";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const progressItemsByItemId = useMemo(() => {
    const map = new Map<string, RoadmapDocument["progress"]["items"][number]>();
    roadmapDoc?.progress.items.forEach((item) => map.set(item.itemId, item));
    return map;
  }, [roadmapDoc]);

  const totalSteps = roadmapDoc?.progress.items.length ?? 0;
  const completedSteps =
    roadmapDoc?.progress.items.filter((item) => item.status === "completed").length ?? 0;

  const handleToggleStep = async (itemId: string) => {
    if (!roadmapDoc) return;

    const currentItem = progressItemsByItemId.get(itemId);
    if (!currentItem) return;

    const newStatus = nextStatus(currentItem.status);

    // Optimistic update
    setRoadmapDoc((prev) => {
      if (!prev) return prev;
      const items = prev.progress.items.map((item) =>
        item.itemId === itemId ? { ...item, status: newStatus } : item
      );
      const percentComplete =
        items.length === 0
          ? 0
          : Math.round((items.filter((i) => i.status === "completed").length / items.length) * 100);
      return { ...prev, progress: { items, percentComplete } };
    });

    try {
      const data = await updateRoadmapProgress(roadmapDoc._id, { itemId, status: newStatus });
      setRoadmapDoc(data.roadmap);
    } catch (err) {
      // Revert on failure
      setRoadmapDoc((prev) => {
        if (!prev) return prev;
        const items = prev.progress.items.map((item) =>
          item.itemId === itemId ? { ...item, status: currentItem.status } : item
        );
        return { ...prev, progress: { ...prev.progress, items } };
      });
      console.error("Failed to update progress:", err);
    }
  };

  const handleRegenerate = async () => {
    if (!roadmapDoc) return;
    setRegenerating(true);
    setError("");

    try {
      const data = await regenerateRoadmap(roadmapDoc._id);
      setRoadmapDoc(data.roadmap);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (err as any)?.response?.data?.error || "We couldn't regenerate the roadmap. Please try again.";
      setError(message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleRetry = () => {
    loadedIdRef.current = null;
    setError("");
    // Re-trigger the effect by forcing a state change via navigate replace
    navigate(location.pathname, { state: locationState, replace: true });
  };

  if (loading) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-status-state">
          <div className="roadmap-spinner" aria-hidden="true" />
          <h2>Generating your personalized roadmap...</h2>
          <p>This can take a few moments while the AI builds your step-by-step plan.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-status-state">
          <h2>We couldn't generate the roadmap</h2>
          <p>{error}</p>
          <button type="button" className="roadmap-btn roadmap-btn-primary" onClick={handleRetry}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!roadmapDoc) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-status-state">
          <h2>No roadmap available yet</h2>
          <p>Select a project from your results or saved projects to generate a roadmap.</p>
          <button type="button" className="roadmap-btn roadmap-btn-primary" onClick={() => navigate("/dashboard")}>
            Find a project
          </button>
        </div>
      </div>
    );
  }

  const { roadmap, projectTitle, userContext } = roadmapDoc;
  const overview = roadmap.projectOverview;

  return (
    <div className="roadmap-page">
      <div className="roadmap-container">
        <header className="roadmap-header">
          <div className="roadmap-header-top">
            <div>
              <h1 className="roadmap-title">{overview?.name || projectTitle}</h1>
              <div className="roadmap-header-badges">
                {overview?.difficulty && (
                  <span className="roadmap-badge roadmap-badge-difficulty">{overview.difficulty}</span>
                )}
                {overview?.estimatedTime && (
                  <span className="roadmap-badge">⏱ {overview.estimatedTime}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="roadmap-btn roadmap-btn-secondary"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              {regenerating ? "Regenerating..." : "Regenerate roadmap"}
            </button>
          </div>

          <p className="roadmap-description">{overview?.description}</p>

          <div className="roadmap-progress-block">
            <ProgressBar currentStep={completedSteps} totalSteps={Math.max(totalSteps, 1)} />
            <span className="roadmap-progress-caption">
              {completedSteps} / {totalSteps} steps completed
            </span>
          </div>
        </header>

        <div className="roadmap-sections">
          <Section title="Overview" defaultOpen>
            <div className="roadmap-overview-grid">
              <div>
                <h4>You will learn</h4>
                <BulletList items={overview?.youWillLearn} />
              </div>
              <div>
                <h4>Main technologies</h4>
                <TagList items={overview?.mainTechnologies} />
                {overview?.optionalTechnologies && overview.optionalTechnologies.length > 0 && (
                  <>
                    <h4 className="roadmap-mt">Optional technologies</h4>
                    <TagList items={overview.optionalTechnologies} />
                  </>
                )}
              </div>
            </div>
            {overview?.outcome && (
              <p className="roadmap-outcome">
                <strong>What you'll build:</strong> {overview.outcome}
              </p>
            )}
          </Section>

          <Section title="Prerequisites">
            <div className="roadmap-two-col">
              <div>
                <h4>Required</h4>
                {roadmap.prerequisites?.required?.map((p) => (
                  <div key={p.skill} className="roadmap-prereq-item">
                    <span className="roadmap-prereq-skill">{p.skill}</span>
                    {p.why && <p className="roadmap-prereq-why">{p.why}</p>}
                  </div>
                ))}
              </div>
              <div>
                <h4>Recommended</h4>
                {roadmap.prerequisites?.recommended?.map((p) => (
                  <div key={p.skill} className="roadmap-prereq-item">
                    <span className="roadmap-prereq-skill">{p.skill}</span>
                    {p.why && <p className="roadmap-prereq-why">{p.why}</p>}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Skill → Project Mapping">
            {roadmap.skillMapping?.map((entry) => (
              <div key={entry.technology} className="roadmap-skill-map-entry">
                <span className="roadmap-tag roadmap-tag-accent">{entry.technology}</span>
                <BulletList items={entry.usedFor} />
              </div>
            ))}
          </Section>

          <Section title="Architecture">
            {roadmap.architecture?.layers && (
              <div className="roadmap-architecture-layers">
                {roadmap.architecture.layers.map((layer, index) => (
                  <div key={layer.name} className="roadmap-architecture-layer">
                    <div className="roadmap-architecture-layer-name">{layer.name}</div>
                    {layer.technology && <div className="roadmap-architecture-layer-tech">{layer.technology}</div>}
                    {layer.responsibility && <p>{layer.responsibility}</p>}
                    {index < roadmap.architecture!.layers!.length - 1 && (
                      <div className="roadmap-architecture-arrow" aria-hidden="true">
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {roadmap.architecture?.dataFlow && (
              <p>
                <strong>Data flow:</strong> {roadmap.architecture.dataFlow}
              </p>
            )}
            {roadmap.architecture?.authFlow && (
              <p>
                <strong>Auth flow:</strong> {roadmap.architecture.authFlow}
              </p>
            )}
          </Section>

          <Section title="Features">
            {roadmap.features?.map((feature) => (
              <div key={feature.name} className="roadmap-feature-card">
                <h4>{feature.name}</h4>
                {feature.description && <p>{feature.description}</p>}
                <BulletList items={feature.subFeatures} />
                <div className="roadmap-feature-meta">
                  {feature.frontendWork && (
                    <p>
                      <strong>Frontend:</strong> {feature.frontendWork}
                    </p>
                  )}
                  {feature.backendWork && (
                    <p>
                      <strong>Backend:</strong> {feature.backendWork}
                    </p>
                  )}
                  {feature.databaseWork && (
                    <p>
                      <strong>Database:</strong> {feature.databaseWork}
                    </p>
                  )}
                </div>
                <TagList items={feature.skillsUsed} />
              </div>
            ))}
          </Section>

          <Section title="Database Design">
            {roadmap.database?.type && (
              <p>
                <strong>{roadmap.database.type}</strong>
                {roadmap.database.reasoning ? ` — ${roadmap.database.reasoning}` : ""}
              </p>
            )}
            {roadmap.database?.collections?.map((collection) => (
              <div key={collection.name} className="roadmap-collection">
                <h4>{collection.name}</h4>
                <pre className="roadmap-code-block">
                  {collection.fields
                    ?.map(
                      (f) =>
                        `${f.name}: ${f.type ?? "string"}${f.required ? " (required)" : ""}${
                          f.notes ? ` // ${f.notes}` : ""
                        }`
                    )
                    .join("\n")}
                </pre>
                {collection.relationships && <p>{collection.relationships}</p>}
                <TagList items={collection.indexes} />
              </div>
            ))}
          </Section>

          <Section title="API Design">
            {roadmap.api?.map((endpoint, index) => (
              <div key={`${endpoint.method}-${endpoint.path}-${index}`} className="roadmap-api-entry">
                <div className="roadmap-api-line">
                  <span className="roadmap-api-method">{endpoint.method}</span>
                  <span className="roadmap-api-path">{endpoint.path}</span>
                  {endpoint.authRequired && <span className="roadmap-tag">Auth required</span>}
                </div>
                {endpoint.purpose && <p>{endpoint.purpose}</p>}
                {endpoint.requestBody && (
                  <pre className="roadmap-code-block">
                    {typeof endpoint.requestBody === "string"
                      ? endpoint.requestBody
                      : JSON.stringify(endpoint.requestBody, null, 2)}
                  </pre>
                )}
                {endpoint.response && (
                  <pre className="roadmap-code-block">
                    {typeof endpoint.response === "string"
                      ? endpoint.response
                      : JSON.stringify(endpoint.response, null, 2)}
                  </pre>
                )}
                <BulletList items={endpoint.errors} />
              </div>
            ))}
          </Section>

          <Section title="Folder Structure">
            {roadmap.folderStructure?.tree && (
              <pre className="roadmap-code-block">{roadmap.folderStructure.tree}</pre>
            )}
            {roadmap.folderStructure?.explanation?.map((entry) => (
              <p key={entry.path}>
                <code>{entry.path}</code> — {entry.purpose}
              </p>
            ))}
          </Section>

          <Section title="Phased Build Order & Steps" defaultOpen>
            {roadmap.phases.map((phase, phaseIndex) => (
              <div key={phase.name} className="roadmap-phase">
                <h3 className="roadmap-phase-title">{phase.name}</h3>
                {phase.goal && <p className="roadmap-phase-goal">{phase.goal}</p>}

                <div className="roadmap-steps">
                  {phase.steps.map((step, stepIndex) => {
                    const itemId = `phase-${phaseIndex}-step-${stepIndex}`;
                    const progressItem = progressItemsByItemId.get(itemId);
                    const status = progressItem?.status ?? "not_started";

                    return (
                      <div key={itemId} className={`roadmap-step roadmap-step-${status}`}>
                        <div className="roadmap-step-header">
                          <button
                            type="button"
                            className={`roadmap-step-status roadmap-step-status-${status}`}
                            onClick={() => handleToggleStep(itemId)}
                            aria-label={`Mark "${step.title}" — currently ${STATUS_LABEL[status]}`}
                          >
                            {status === "completed" ? "✓" : status === "in_progress" ? "…" : ""}
                          </button>
                          <span className="roadmap-step-title">{step.title}</span>
                          <span className="roadmap-step-status-label">{STATUS_LABEL[status]}</span>
                        </div>

                        {step.goal && (
                          <p>
                            <strong>Goal:</strong> {step.goal}
                          </p>
                        )}
                        {step.implementation && (
                          <p>
                            <strong>Implementation:</strong> {step.implementation}
                          </p>
                        )}
                        {step.why && (
                          <p>
                            <strong>Why:</strong> {step.why}
                          </p>
                        )}
                        {step.expectedResult && (
                          <p>
                            <strong>Expected result:</strong> {step.expectedResult}
                          </p>
                        )}
                        {step.filesInvolved && step.filesInvolved.length > 0 && (
                          <pre className="roadmap-code-block roadmap-code-block-small">
                            {step.filesInvolved.join("\n")}
                          </pre>
                        )}
                        <TagList items={step.skillsUsed} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </Section>

          <Section title="Technology Choices & Alternatives">
            {roadmap.technologyChoices?.map((choice) => (
              <div key={choice.decision} className="roadmap-tech-choice">
                <h4>{choice.decision}</h4>
                <div className="roadmap-tech-options">
                  {choice.options?.map((option) => (
                    <div
                      key={option.name}
                      className={`roadmap-tech-option${
                        option.name === choice.recommended ? " roadmap-tech-option-recommended" : ""
                      }`}
                    >
                      <div className="roadmap-tech-option-name">
                        {option.name}
                        {option.name === choice.recommended && (
                          <span className="roadmap-tag roadmap-tag-accent">Recommended</span>
                        )}
                      </div>
                      {option.bestWhen && <p>Best when: {option.bestWhen}</p>}
                    </div>
                  ))}
                </div>
                {choice.reasoning && (
                  <p className="roadmap-tech-reasoning">
                    <strong>Why {choice.recommended}:</strong> {choice.reasoning}
                  </p>
                )}
              </div>
            ))}
          </Section>

          <Section title="Learning Gaps">
            <div className="roadmap-skills-columns">
              <div>
                <h4>Already know</h4>
                <TagList items={userContext?.skills} />
              </div>
              <div>
                <h4>Need to learn</h4>
                <TagList items={roadmap.learningGaps?.map((g) => g.skill)} />
              </div>
            </div>
            {roadmap.learningGaps?.map((gap) => (
              <div key={gap.skill} className="roadmap-learning-gap">
                <h4>{gap.skill}</h4>
                {gap.why && <p>{gap.why}</p>}
                {gap.usedWhere && (
                  <p>
                    <strong>Used in:</strong> {gap.usedWhere}
                  </p>
                )}
                {gap.difficulty && <span className="roadmap-tag">{gap.difficulty}</span>}
                {gap.learningOrder && gap.learningOrder.length > 0 && (
                  <ol className="roadmap-numbered-list">
                    {gap.learningOrder.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </Section>

          <Section title="Testing Roadmap">
            <div className="roadmap-testing-grid">
              <div>
                <h4>Unit</h4>
                <BulletList items={roadmap.testing?.unit} />
              </div>
              <div>
                <h4>API</h4>
                <BulletList items={roadmap.testing?.api} />
              </div>
              <div>
                <h4>Integration</h4>
                <BulletList items={roadmap.testing?.integration} />
              </div>
              <div>
                <h4>UI</h4>
                <BulletList items={roadmap.testing?.ui} />
              </div>
              <div>
                <h4>Edge cases</h4>
                <BulletList items={roadmap.testing?.edgeCases} />
              </div>
            </div>
          </Section>

          <Section title="Security Checklist">
            <BulletList items={roadmap.security} />
          </Section>

          <Section title="Deployment Roadmap">
            <div className="roadmap-testing-grid">
              <div>
                <h4>Frontend</h4>
                <BulletList items={roadmap.deployment?.frontend} />
              </div>
              <div>
                <h4>Backend</h4>
                <BulletList items={roadmap.deployment?.backend} />
              </div>
              <div>
                <h4>Database</h4>
                <BulletList items={roadmap.deployment?.database} />
              </div>
              <div>
                <h4>Environment variables</h4>
                <BulletList items={roadmap.deployment?.environmentVariables} />
              </div>
            </div>
            <h4 className="roadmap-mt">Production checklist</h4>
            <BulletList items={roadmap.deployment?.productionChecklist} />
          </Section>

          <Section title="Final Checklist" defaultOpen>
            <ul className="roadmap-checklist">
              {roadmap.finalChecklist.map((item) => (
                <li key={item}>☐ {item}</li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default RoadmapPage;