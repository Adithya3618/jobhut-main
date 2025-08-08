import AdminLogin from '../components/AdminLogin'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageViewWrapper from '../components/PageViewWrapper'

export default function Admin() {
  return (
    <PageViewWrapper>
    <div>
      <Header />
      <AdminLogin />
      <Footer/>
    </div>
    </PageViewWrapper>
  )
}