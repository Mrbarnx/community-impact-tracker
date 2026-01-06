import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ProjectStatus = 'Ongoing' | 'Starting' | 'Completed' | 'Urgent'
export type ProjectSector = 'Health' | 'Education' | 'Infrastructure' | 'Environment'

export type StatusVariant = 'default' | 'goal' | 'urgent' | 'starting'

export interface CommunityProject {
  id: number
  title: string
  description: string
  sector: ProjectSector
  status: ProjectStatus
  statusVariant: StatusVariant
  location: string
  dateLabel: string
  startDate: string
  fundingGoal: number
  fundingRaised: number
  mealsServed: number
  treesPlanted: number
  volunteers: number
  activeInitiatives: number
  citizensEngaged: number
  thumbnail: string
}

export interface FilterState {
  search: string
  sector: 'All' | ProjectSector
  location: 'All' | string
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

const MOCK_PROJECTS: CommunityProject[] = [
  {
    id: 1,
    title: 'Green City Initiative',
    description:
      'Transforming underused lots into climate-ready green corridors that cool neighborhoods and capture carbon.',
    sector: 'Environment',
    status: 'Ongoing',
    statusVariant: 'default',
    location: 'Citywide',
    dateLabel: 'Updated Nov 2024',
    startDate: '2024-04-01',
    fundingGoal: 3500000,
    fundingRaised: 2810000,
    mealsServed: 0,
    treesPlanted: 1200,
    volunteers: 8,
    activeInitiatives: 9,
    citizensEngaged: 1600,
    thumbnail: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Tech for Schools',
    description:
      'Delivering hybrid-ready classrooms with connectivity grants, devices, and training for educators.',
    sector: 'Education',
    status: 'Ongoing',
    statusVariant: 'default',
    location: 'North District',
    dateLabel: 'Updated Dec 2024',
    startDate: '2024-06-18',
    fundingGoal: 2100000,
    fundingRaised: 1300000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 6,
    activeInitiatives: 6,
    citizensEngaged: 1400,
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Mobile Health Clinics',
    description: 'Pop-up preventative care and screening clinics serving high-need neighborhoods weekly.',
    sector: 'Health',
    status: 'Urgent',
    statusVariant: 'urgent',
    location: 'Ward 3',
    dateLabel: 'Updated Dec 2024',
    startDate: '2024-02-10',
    fundingGoal: 1800000,
    fundingRaised: 1250000,
    mealsServed: 840,
    treesPlanted: 0,
    volunteers: 10,
    activeInitiatives: 7,
    citizensEngaged: 1700,
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Urban Forest Project',
    description: 'Community-led tree planting that completed a continuous canopy along the urban trail loop.',
    sector: 'Environment',
    status: 'Completed',
    statusVariant: 'goal',
    location: 'Urban Loop',
    dateLabel: 'Completed Oct 2024',
    startDate: '2023-08-18',
    fundingGoal: 1200000,
    fundingRaised: 1200000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 7,
    activeInitiatives: 6,
    citizensEngaged: 1500,
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'STEM After School',
    description:
      'Hands-on robotics and coding labs opening in community centers to grow the future civic tech talent pool.',
    sector: 'Education',
    status: 'Starting',
    statusVariant: 'starting',
    location: 'South End',
    dateLabel: 'Launching Feb 2025',
    startDate: '2025-01-12',
    fundingGoal: 1200000,
    fundingRaised: 380000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 5,
    activeInitiatives: 7,
    citizensEngaged: 1300,
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Clean Water Access',
    description: 'Resilient filtration upgrades and hydration stations keeping every block supplied with safe water.',
    sector: 'Infrastructure',
    status: 'Ongoing',
    statusVariant: 'default',
    location: 'River District',
    dateLabel: 'Updated Dec 2024',
    startDate: '2024-05-04',
    fundingGoal: 2700000,
    fundingRaised: 2100000,
    mealsServed: 0,
    treesPlanted: 0,
    volunteers: 6,
    activeInitiatives: 7,
    citizensEngaged: 1000,
    thumbnail: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
  },
]

const HERO_SPOTLIGHT: SpotlightProject = {
  title: 'Urban Renewal Phase 2',
  subtitle: 'Downtown District',
  badge: 'LIVE',
  badgeTone: 'live',
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
}

export const useProjectStore = defineStore('projects', () => {
  const projects = ref<CommunityProject[]>([])
  const filters = ref<FilterState>({ search: '', sector: 'All', location: 'All' })
  const darkMode = ref(true)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    const isLight = !darkMode.value
    document.documentElement.classList.toggle('theme-light', isLight)
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
    filters.value = { ...filters.value, ...partial }
  }

  const resetFilters = () => {
    filters.value = { search: '', sector: 'All', location: 'All' }
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
    const query = filters.value.search.trim().toLowerCase()

    return projects.value.filter((project) => {
      const matchesSector = filters.value.sector === 'All' || project.sector === filters.value.sector
      const matchesLocation = filters.value.location === 'All' || project.location === filters.value.location
      const matchesQuery =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)

      return matchesSector && matchesLocation && matchesQuery
    })
  })

  const impactTotals = computed<ImpactTotals>(() => {
    const aggregation = filteredProjects.value.reduce(
      (acc, project) => {
        acc.meals += project.mealsServed
        acc.trees += project.treesPlanted
        acc.volunteers += project.volunteers
        acc.citizensEngaged += project.citizensEngaged
        acc.totalBudget += project.fundingGoal
        acc.totalRaised += project.fundingRaised
        acc.activeProjects += project.activeInitiatives
        return acc
      },
      { meals: 0, trees: 0, volunteers: 0, citizensEngaged: 0, totalBudget: 0, totalRaised: 0, activeProjects: 0 }
    )

    return aggregation
  })

  const highlightProject = computed(() => HERO_SPOTLIGHT)

  applyTheme()

  return {
    projects,
    filters,
    loading,
    error,
    darkMode,
    locationOptions,
    filteredProjects,
    impactTotals,
    highlightProject,
    fetchProjects,
    setFilter,
    resetFilters,
    toggleDarkMode,
  }
})
