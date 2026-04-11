import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthGuard } from './guards/AuthGuard'
import { ROUTES } from './routes'

import { LoginPage } from '@/pages/auth/LoginPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { PersonsListPage } from '@/pages/persons/PersonsListPage'
import { PersonDetailPage } from '@/pages/persons/PersonDetailPage'
import { PersonFormPage } from '@/pages/persons/PersonFormPage'
import { EventsListPage } from '@/pages/events/EventsListPage'
import { EventDetailPage } from '@/pages/events/EventDetailPage'
import { EventCreatePage } from '@/pages/events/EventCreatePage'
import { MembershipsPage } from '@/pages/memberships/MembershipsPage'
import { ManadasListPage } from '@/pages/manadas/ManadasListPage'
import { ManadaDetailPage } from '@/pages/manadas/ManadaDetailPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<AuthGuard />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PERSONS.LIST} element={<PersonsListPage />} />
          <Route path={ROUTES.PERSONS.CREATE} element={<PersonFormPage />} />
          <Route path={ROUTES.PERSONS.DETAIL} element={<PersonDetailPage />} />
          <Route path={ROUTES.EVENTS.LIST} element={<EventsListPage />} />
          <Route path={ROUTES.EVENTS.CREATE} element={<EventCreatePage />} />
          <Route path={ROUTES.EVENTS.DETAIL} element={<EventDetailPage />} />
          <Route path={ROUTES.MEMBERSHIPS.LIST} element={<MembershipsPage />} />
          <Route path={ROUTES.MANADAS.LIST} element={<ManadasListPage />} />
          <Route path={ROUTES.MANADAS.DETAIL} element={<ManadaDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
