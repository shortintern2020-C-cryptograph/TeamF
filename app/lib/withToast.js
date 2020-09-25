import { useToasts } from 'react-toast-notifications'

/**
 * HOC for class components
 * use useToast() hook for functional components
 * @param {*} Component
 */
export const withToast = (Component) => {
  return function WrappedComponent(props) {
    const toastFuncs = useToasts()
    return <Component {...props} {...toastFuncs} />
  }
}

// //In you class component file

// class MyComponent extends Component {

//   componentDidMount () {
//     this.props.addToast('Hello Toast');
//   }

//   render () {
//     return <div>Toasts</div>
//   }
// }

// export default withToast(MyComponent);
