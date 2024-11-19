import React, { useState } from 'react';
import { Col, Nav, Tab } from 'react-bootstrap';
import './TabList.scss';
import './../../app/styles/commonStyles.scss';
import '../../app/styles/colors.scss';

const TabList = ({ tabs }) => {
    const [activeKey, setActiveKey] = useState(tabs[0].key);

    return (
        <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
            <Nav style={{ height: 50, boxShadow: '0 4px 4px rgba(0, 0, 0, 0.4)' }} variant="pills" className="mb-3 tab-list-nav bg-focus_input_color">
                {tabs.map((tab) => (
                    <Nav.Item key={tab.key} className="flex-fill text-center">
                        <Nav.Link eventKey={tab.key} className="tab-link">
                            {tab.title}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
            <Tab.Content>
                {tabs.map((tab) => (
                    <Tab.Pane key={tab.key} eventKey={tab.key}>
                        {tab.content}
                    </Tab.Pane>
                ))}
            </Tab.Content>
        </Tab.Container>
    );
};

export default TabList;
