import React, { Component, ReactNode, SyntheticEvent } from 'react';
import ApiCalendar from 'react-google-calendar-api';

export default class Calendar extends Component {
	render() {
		return (
			<div>
				<iframe
					className="calendar"
					src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&title=Tennis%20Tournaments&src=ZTUyN21nODkxNTdpdTlqcnNvbWFycnUyczRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=cmR2Ym9uZGloYXI1Ym5xMTVubWpkOWwwaWNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%237CB342&color=%23B39DDB"
					frameBorder="0"
					scrolling="yes"
				/>
			</div>
		);
	}
}
