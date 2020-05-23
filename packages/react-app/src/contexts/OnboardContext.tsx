/* eslint-disable no-console */
import React, { Component, createContext, ReactElement, useContext } from 'react';
import PropTypes from 'prop-types';

import Onboard from 'bnc-onboard';
import {
  API,
  ConfigOptions,
  Initialization,
  UserState,
  WalletInitOptions,
  WalletCheckInit,
  Wallet,
} from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-unresolved

import { Address } from '../types/types';

interface Props {
  children: ReactElement | Array<ReactElement>;
}

interface State extends UserState {
  onboard: API;
  setup: Function;
}

export const OnboardContext = createContext({} as State);

export function useOnboardContext(): State {
  return useContext(OnboardContext);
}

const walletChecks: Array<WalletCheckInit> = [{ checkName: 'connect' }, { checkName: 'network' }];

// dappid is mandatory so will have throw away id for local usage.
const wallets: Array<WalletInitOptions> = [{ walletName: 'metamask', preferred: true }];

const testid = 'c212885d-e81d-416f-ac37-06d9ad2cf5af';

class OnboardProvider extends Component<Props, State> {
  state: Readonly<State> = {
    onboard: {} as API,
    address: '',
    balance: '',
    network: 0,
    wallet: {} as Wallet,
    mobileDevice: false,
    appNetworkId: 0,
    setup: () => null,
  };

  static propTypes = {
    children: PropTypes.any.isRequired,
  };

  constructor(props: Props) {
    super(props);

    const initialisation: Initialization = {
      dappId: testid,
      networkId: 3,
      walletCheck: walletChecks,
      walletSelect: {
        heading: 'Connect your wallet to Cover',
        description: 'To use Cover you need an Ethereum wallet. Please select one from below:',
        wallets,
      },
      subscriptions: {
        address: (address: Address): void => {
          this.setState({ address });
        },
        balance: (balance: string): void => {
          this.setState({ balance });
        },
        network: (network: number): void => {
          this.setState({ network });
        },
        wallet: (wallet: Wallet): void => {
          this.setState({ wallet });
        },
      },
    };

    const onboard: API = Onboard(initialisation);

    this.state = {
      ...this.state,
      onboard,
    };
  }

  setup = async (defaultWallet: string): Promise<void> => {
    const { onboard } = this.state;
    try {
      const selected = await onboard.walletSelect(defaultWallet);
      if (selected) {
        const ready = await onboard.walletCheck();
        if (ready) {
          const walletState = onboard.getState();
          this.setState({ ...walletState });
          console.log(walletState);
        } else {
          // Connection to wallet failed
        }
      } else {
        // User aborted set up
      }
    } catch (error) {
      console.log('error onboarding', error);
    }
  };

  setConfig = (config: ConfigOptions): void => this.state.onboard.config(config);

  render(): ReactElement {
    return (
      <OnboardContext.Provider value={{ ...this.state, setup: this.setup }}>
        {this.props.children}
      </OnboardContext.Provider>
    );
  }
}

export const useOnboard = (): API => {
  const { onboard } = useOnboardContext();
  return onboard;
};

export const useGetState = (): UserState => {
  const { onboard } = useOnboardContext();
  return onboard.getState();
};

export const useAddress = (): Address => {
  const { address } = useOnboardContext();
  return address;
};

export const useWallet = (): Wallet => {
  const { wallet } = useOnboardContext();
  return wallet;
};

export const useSetup = (): Function => {
  const { setup } = useOnboardContext();
  return setup;
};

export default OnboardProvider;
