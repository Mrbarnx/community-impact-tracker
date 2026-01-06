import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export type ProjectStatus = 'Ongoing' | 'Starting' | 'Completed' | 'Urgent'
export type ProjectCause = 'Food' | 'Environment' | 'Education' | 'Infrastructure' | 'Health'
export type StatusVariant = 'default' | 'goal' | 'urgent' | 'starting'

export interface Project {
  id: number
  title: string
  description: string
  cause: ProjectCause
  status: ProjectStatus
  statusVariant: StatusVariant
  location: string
  dateLabel: string
  startDate: string
  fundingGoal: number
  fundingRaised: number
  mealsServed?: number
  treesPlanted?: number
  volunteers: number
  activeInitiatives?: number
  citizensEngaged?: number
  thumbnail: string
}

export type SectorFilter = 'All' | ProjectCause

export interface FilterState {
  search: string
  sector: SectorFilter
  location: SectorFilter | string
}

export interface VolunteerSubmission {
  id: string
  name: string
  email: string
  phone?: string
  cause: ProjectCause  // This now allows all ProjectCause values
  location: string
  availability: ('weekdays' | 'weekends' | 'evenings')[]
  message?: string
  submittedAt: string
}

export interface ImpactTotals {
  meals: number
  trees: number
  volunteers: number
  totalBudget: number
  totalRaised: number
  activeProjects: number
  citizensEngaged: number
}

export interface SpotlightProject {
  title: string
  subtitle: string
  badge: string
  badgeTone: 'live' | 'default'
  thumbnail: string
}

export interface AboutContent {
  mission: string
  story: {
    title: string
    body: string
    highlight: string
  }
  metrics: { label: string; value: string }[]
  highlights: { icon: string; title: string; description: string }[]
}

export interface OpenDataDataset {
  id: string
  title: string
  description: string
  updatedAt: string
  downloadUrl: string
  tags: string[]
  records: number
}

const LOCAL_STORAGE_KEY = 'volunteers'

const loadVolunteerSubmissions = (): VolunteerSubmission[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as VolunteerSubmission[]
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      ...item,
      availability: Array.isArray(item.availability) ? item.availability : [],
    }))
  } catch (error) {
    console.warn('Unable to read volunteer submissions from localStorage.', error)
    return []
  }
}

const persistVolunteerSubmissions = (submissions: VolunteerSubmission[]) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(submissions))
  } catch (error) {
    console.warn('Unable to persist volunteer submissions to localStorage.', error)
  }
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Green City Initiative',
    description:
      'Transforming underused lots into climate-ready green corridors that cool neighborhoods and capture carbon.',
    cause: 'Environment',
    status: 'Ongoing',
    statusVariant: 'default',
    location: 'Citywide',
    dateLabel: 'Updated Nov 2024',
    startDate: '2024-04-01',
    fundingGoal: 3_500_000,
    fundingRaised: 2_810_000,
    mealsServed: 0,
    treesPlanted: 1_200,
    volunteers: 8,
    activeInitiatives: 9,
    citizensEngaged: 1_600,
    thumbnail: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Tech for Schools',
    description:
      'Delivering hybrid-ready classrooms with connectivity grants, devices, and training for educators.',
    cause: 'Education',
    status: 'Ongoing',
    statusVariant: 'default',
    location: 'North District',
    dateLabel: 'Updated Dec 2024',
    startDate: '2024-06-18',
    fundingGoal: 2_100_000,
    fundingRaised: 1_300_000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 6,
    activeInitiatives: 6,
    citizensEngaged: 1_400,
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Mobile Health Clinics',
    description: 'Pop-up preventative care and screening clinics serving high-need neighborhoods weekly.',
    cause: 'Health',
    status: 'Urgent',
    statusVariant: 'urgent',
    location: 'Ward 3',
    dateLabel: 'Updated Dec 2024',
    startDate: '2024-02-10',
    fundingGoal: 1_800_000,
    fundingRaised: 1_250_000,
    mealsServed: 840,
    treesPlanted: 0,
    volunteers: 10,
    activeInitiatives: 7,
    citizensEngaged: 1_700,
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Urban Forest Project',
    description: 'Community-led tree planting that completed a continuous canopy along the urban trail loop.',
    cause: 'Environment',
    status: 'Completed',
    statusVariant: 'goal',
    location: 'Urban Loop',
    dateLabel: 'Completed Oct 2024',
    startDate: '2023-08-18',
    fundingGoal: 1_200_000,
    fundingRaised: 1_200_000,
    mealsServed: 0,
    treesPlanted: 400,
    volunteers: 7,
    activeInitiatives: 6,
    citizensEngaged: 1_500,
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'STEM After School',
    description:
      'Hands-on robotics and coding labs opening in community centers to grow the future civic tech talent pool.',
    cause: 'Education',
    status: 'Starting',
    statusVariant: 'starting',
    location: 'South End',
    dateLabel: 'Launching Feb 2025',
    startDate: '2025-01-12',
    fundingGoal: 1_200_000,
    fundingRaised: 380_000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 5,
    activeInitiatives: 7,
    citizensEngaged: 1_300,
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Clean Water Access',
    description: 'Resilient filtration upgrades and hydration stations keeping every block supplied with safe water.',
    cause: 'Infrastructure',
    status: 'Ongoing',
    statusVariant: 'default',
    location: 'River District',
    dateLabel: 'Updated Dec 2024',
    startDate: '2024-05-04',
    fundingGoal: 2_700_000,
    fundingRaised: 2_100_000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 6,
    activeInitiatives: 7,
    citizensEngaged: 1_000,
    thumbnail: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
  },
]

const HERO_SPOTLIGHT: SpotlightProject = {
  title: 'Urban Renewal Phase 2',
  subtitle: 'Downtown District',
  badge: 'LIVE',
  badgeTone: 'live' as const,
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
}

const ABOUT_CONTENT: AboutContent = {
  mission:
    'Civic Impact makes project outcomes and public funding transparent so every resident understands where investments flow and how lives change.',
  story: {
    title: 'We steward community-led regeneration',
    body:
      'Founded in 2018, Civic Impact partnered with neighborhood coalitions, city agencies, and open data labs to build a living dashboard of civic projects. Today our platform powers weekly updates, volunteer mobilization, and policy insight for stakeholders across the city.',
    highlight:
      '“When communities can see the full picture, they lean in harder. Our job is to publish the data, stories, and pathways that make collaboration natural.”',
  },
  metrics: [
    { label: 'Projects documented', value: '185+' },
    { label: 'Partner agencies', value: '32' },
    { label: 'Volunteer network', value: '4.3K' },
    { label: 'Communities served', value: '21' },
  ],
  highlights: [
    {
      icon: 'insights',
      title: 'Realtime transparency',
      description: 'Budget, procurement, and impact logs published every week across all projects.',
    },
    {
      icon: 'groups',
      title: 'Coalition-first',
      description: 'Neighborhood stewards, youth councils, and advisory boards shape every roadmap.',
    },
    {
      icon: 'hub',
      title: 'Open APIs',
      description: 'Developers integrate live datasets into the services that residents already use.',
    },
    {
      icon: 'verified_user',
      title: 'Accountability loops',
      description: 'Public audits and citizen feedback cycles drive decisions and keep projects on track.',
    },
  ],
}

const OPEN_DATASETS: OpenDataDataset[] = [
  {
    id: 'budget-tracker',
    title: 'Capital Project Budget Tracker',
    description: 'Monthly disbursements, commitments, and vendor payments across active infrastructure projects.',
    updatedAt: 'Jan 2, 2026',
    downloadUrl: '#',
    tags: ['finance', 'infrastructure', 'transparency'],
    records: 128_450,
  },
  {
    id: 'impact-journal',
    title: 'Community Impact Journal',
    description: 'A weekly log of impact metrics including citizens engaged, program attendance, and satisfaction scores.',
    updatedAt: 'Dec 28, 2025',
    downloadUrl: '#',
    tags: ['engagement', 'outcomes'],
    records: 62_380,
  },
  {
    id: 'climate-readiness',
    title: 'Climate Readiness Interventions',
    description: 'Tree canopy, cooling infrastructure, and flood mitigation improvements by neighborhood.',
    updatedAt: 'Dec 30, 2025',
    downloadUrl: '#',
    tags: ['environment', 'resilience'],
    records: 44_910,
  },
  {
    id: 'volunteer-roster',
    title: 'Volunteer Mobilization Roster',
    description: 'Anonymized volunteer activity, skills inventory, and hours contributed per project.',
    updatedAt: 'Jan 4, 2026',
    downloadUrl: '#',
    tags: ['community', 'volunteers'],
    records: 18_205,
  },
]

const createVolunteerId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `vol_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const useCommunityStore = defineStore('community', () => {
  const projects = ref<Project[]>([])
  const filters = reactive<FilterState>({ search: '', sector: 'All', location: 'All' })
  const volunteerSubmissions = ref<VolunteerSubmission[]>(loadVolunteerSubmissions())
  const darkMode = ref(true)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const aboutContent = ref<AboutContent>(ABOUT_CONTENT)
  const openDataSets = ref<OpenDataDataset[]>(OPEN_DATASETS)

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('theme-light', !darkMode.value)
  }

  const fetchProjects = async () => {
    loading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 420))
      projects.value = MOCK_PROJECTS
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to load projects right now.'
    } finally {
      loading.value = false
    }
  }

  const setFilter = (partial: Partial<FilterState>) => {
    Object.assign(filters, partial)
  }

  const resetFilters = () => {
    filters.search = ''
    filters.sector = 'All'
    filters.location = 'All'
  }

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    applyTheme()
  }

  const locationOptions = computed(() => {
    const unique = new Set<string>(['All'])
    projects.value.forEach((project) => unique.add(project.location))
    return Array.from(unique)
  })

  const filteredProjects = computed(() => {
    const query = filters.search.trim().toLowerCase()

    return projects.value.filter((project) => {
      const matchesSector = filters.sector === 'All' || project.cause === filters.sector
      const matchesLocation = filters.location === 'All' || project.location === filters.location
      const matchesQuery =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)

      return matchesSector && matchesLocation && matchesQuery
    })
  })

  const impactTotals = computed<ImpactTotals>(() => {
    const baseAggregation = projects.value.reduce(
      (acc, project) => {
        acc.meals += project.mealsServed ?? 0
        acc.trees += project.treesPlanted ?? 0
        acc.volunteers += project.volunteers
        acc.citizensEngaged += project.citizensEngaged ?? 0
        acc.totalBudget += project.fundingGoal
        acc.totalRaised += project.fundingRaised
        acc.activeProjects += project.activeInitiatives ?? 0
        return acc
      },
      { meals: 0, trees: 0, volunteers: 0, citizensEngaged: 0, totalBudget: 0, totalRaised: 0, activeProjects: 0 }
    )

    baseAggregation.volunteers += volunteerSubmissions.value.length
    return baseAggregation
  })

  const volunteerCount = computed(() => {
    return volunteerSubmissions.value.length + projects.value.reduce((sum, project) => sum + project.volunteers, 0)
  })

  const submitVolunteer = async (
    payload: Omit<VolunteerSubmission, 'id' | 'submittedAt'>
  ): Promise<{ success: true }> => {
    const entry: VolunteerSubmission = {
      ...payload,
      id: createVolunteerId(),
      submittedAt: new Date().toISOString(),
    }

    volunteerSubmissions.value = [entry, ...volunteerSubmissions.value]
    persistVolunteerSubmissions(volunteerSubmissions.value)

    return { success: true }
  }

  const loadVolunteerCache = () => {
    volunteerSubmissions.value = loadVolunteerSubmissions()
  }

  const highlightProject = computed(() => HERO_SPOTLIGHT)

  applyTheme()

  return {
    projects,
    filters,
    loading,
    error,
    darkMode,
    volunteerSubmissions,
    locationOptions,
    filteredProjects,
    impactTotals,
    volunteerCount,
    aboutContent,
    openDataSets,
    highlightProject,
    fetchProjects,
    submitVolunteer,
    loadVolunteerCache,
    setFilter,
    resetFilters,
    toggleDarkMode,
  }
})
