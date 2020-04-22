export default async function ({ store, redirect }) {
    if (store.state.auth.loggedIn) {
    
      return redirect('/profile')
    }
  }