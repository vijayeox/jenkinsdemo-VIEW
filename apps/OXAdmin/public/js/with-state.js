import React from 'react';

import { process } from '@progress/kendo-data-query';

export function withState(WrappedGrid) {
	return class StatefulGrid extends React.Component {
		constructor(props) {
			super(props);
			if (props.pageable === false) {
				this.state = {};
			} else {
				this.state = {
					skip: 0,
					take: 10,
				};
			}
		}

		render() {
			return (
				<WrappedGrid
					filterable
					sortable
					pageable
					{...this.props}
					{...this.state}
					data={process(this.props.data, this.state)}
					onDataStateChange={e => {
						this.setState(e.data);
					}}
				/>
			);
		}
	};
}
