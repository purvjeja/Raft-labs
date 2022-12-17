import { Button, MenuItem, Modal, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Graph } from 'react-d3-graph';
import './css/social-media-app.css'

interface ISetRelationship {
    people1: string;
    relationshipType: string;
    people2: string;
    color: string;
}


export default function SocialMedia() {
    const [people, setPeople] = useState<string[]>(['sameer', 'aayushi', 'bhaskar', 'kamalnath', 'shanti']);
    const [relationship, setRelationship] = useState<ISetRelationship[]>([{ people1: 'sameer', relationshipType: 'friend', people2: 'aayushi', color: 'black' }, { people1: 'aayushi', relationshipType: 'friend', people2: 'bhaskar', color: 'black' }
        , { people1: 'sameer', relationshipType: 'friend', people2: 'kamalnath', color: 'black' }, { people1: 'kamalnath', relationshipType: 'friend', people2: 'shanti', color: 'black' }, { people1: 'shanti', relationshipType: 'friend', people2: 'bhaskar', color: 'black' }]);
    const [relationshipModal, setRelationshipModal] = useState<boolean>(false);
    const [peopleModal, setPeopleModal] = useState<boolean>(false);
    const [selectedPerson1, setSelectedPerson1] = useState<string | undefined>(undefined);
    const [selectedPerson2, setSelectedPerson2] = useState<string | undefined>(undefined);

    const data = {
        nodes: people.map(p => { return { id: p, strokeColor: selectedPerson1 === p || selectedPerson2 === p ? 'yellow   ' : '' } }),
        links: relationship.map(r => {
            return { source: r.people1, target: r.people2, color: r.color }
        })
    };

    const myConfig = {
        // nodeHighlightBehavior: true,
        node: {
            color: 'red',
            border: 'white',
            size: 2000,
            fontSize: 20,
            highlightfontSize: 20
        },
        link: {
            color: 'black',
            size: 600,
        }
    };

    // const updateRelation = () => {
    // setRelationship(updatedRelationShip);


    // recursive code for nodes linking 

    // let linksToColor = [];
    // const searchForTheirRelationship = (person: string | undefined) => {
    //     let count = 0;
    //     relationship.forEach(r => {
    //         if (r.people1 === person) count++;
    //     });

    //     for (let i = 0; i < count; i++) {
    //         let found = true;
    //         while (found) {
    //             updatedRelationShip.forEach(r => {
    //                 if(r.people2 === selectedPerson2) found = false;
    //                 else searchForTheirRelationship(person2);
    //             });
    //         }
    //         return true;
    //     }
    // }
    // searchForTheirRelationship(selectedPerson1);
    // }

    const onClickNode = function (nodeId: string) {
        if (selectedPerson1 === nodeId) setSelectedPerson1(undefined);
        else {
            if (selectedPerson1 === undefined) setSelectedPerson1(nodeId);
            else if (selectedPerson2 === undefined) {
                setSelectedPerson2(nodeId)
            }
        }
        if (selectedPerson2 === nodeId) setSelectedPerson2(undefined);

        if (selectedPerson1 && selectedPerson2) {
            // updateRelation()
            setRelationship(relationship.map(r => {
                let flag = r;
                flag.color = 'yellow';
                return flag;
            }));
        } else {
            setRelationship(relationship.map(r => {
                let flag = r;
                flag.color = 'black';
                return flag;
            }));
        }
    };

    useEffect(() => {
    //     if (selectedPerson1 && selectedPerson2) {
    //         // updateRelation()
    //         setRelationship(relationship.map(r => {
    //             let flag = r;
    //             flag.color = 'yellow';
    //             return flag;
    //         }));
    //     } else {
    //         setRelationship(relationship.map(r => {
    //             let flag = r;
    //             flag.color = 'black';
    //             return flag;
    //         }));
    // }

    }, [selectedPerson1, selectedPerson2])

    const onPeopleAdd = (peopleInput: string) => setPeople([...people, peopleInput]);

    const onRelationshipAdd = (relationshipInput: ISetRelationship) => {
        setRelationship([...relationship, relationshipInput]);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div>
                <Button className="addingButtons" sx={{ margin: '10px' }} variant="contained" onClick={() => setPeopleModal(true)}>Add People</Button>
                <Button className="addingButtons" variant="contained" onClick={() => setRelationshipModal(true)}>Add Relationship</Button>
            </div>
            <Modal open={peopleModal} onClose={() => setPeopleModal(false)}>
                <PeopleModalContent addPeople={onPeopleAdd} />
            </Modal>
            <Modal open={relationshipModal} onClose={() => setRelationshipModal(false)} >
                <RelationshipModalContent addRelationship={onRelationshipAdd} peopleList={people} />
            </Modal>
            <Graph
                id='degree-of-connections'
                data={data}
                config={myConfig}
                onClickNode={(nodeId: string) => onClickNode(nodeId)}
            />
        </div >
    )
}

function PeopleModalContent(props: { addPeople: (input: string) => void }) {
    const [input, setInput] = useState<string>('');

    return (
        <div className="Modal">
            <TextField label='Enter person name' onChange={(e) => setInput(e.target.value)} defaultValue={input} />
            <Button onClick={() => props.addPeople(input)}>Add</Button>
        </div>
    )
}

function RelationshipModalContent(props: { addRelationship: (input: ISetRelationship) => void, peopleList: string[] }) {
    const { addRelationship, peopleList } = props;
    const [input, setInput] = useState<string>('');
    const [firstPerson, setFirstPerson] = useState<string>(peopleList[0] || '');
    const secondDropDownList = peopleList.filter(p => p !== firstPerson);
    const [secondPerson, setSecondPerson] = useState<string>(secondDropDownList[0] || '');
    const onFirstPersonSelect = (event: SelectChangeEvent) => setFirstPerson(event.target.value);
    const onSecondPersonSelect = (event: SelectChangeEvent) => setSecondPerson(event.target.value);

    return (
        <div className="Modal">
            <Select defaultValue={firstPerson} onChange={onFirstPersonSelect}>
                {peopleList.map(people => (
                    <MenuItem value={people}>{people}</MenuItem>
                ))}
            </Select>
            <TextField label="Enter Relationship type" onChange={(e) => setInput(e.target.value)} defaultValue={input} />
            <Select label="Select Persone 2 Name" onChange={onSecondPersonSelect} defaultValue={secondPerson}>
                {secondDropDownList.map(people => (
                    <MenuItem value={people}>{people}</MenuItem>
                ))}
            </Select>
            <Button onClick={() => addRelationship({ people1: firstPerson, people2: secondPerson, color: 'black', relationshipType: input })}>Add</Button>
        </div>
    )
}