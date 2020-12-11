import React,{Component} from "react"
import {get,isEmpty,groupBy,map} from "lodash"

class CalculateSalary extends Component{

    state={
        staffData : [],
        salary:[],
        totalSalary: '',
    }
    componentDidMount=async ()=> {
        await fetch('https://cors-anywhere.herokuapp.com/http://34.198.81.140/attendance.json',{
            method : 'GET',
            headers : {"Content-Type": "application/json"},
        }).then(response => response.json())
            .then(data => {
                this.setState({staffData: data})
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    calculateSalary=async ()=>{
        let totalMaleSalary = 0
        let totalFemaleSalary = 0
        const groupByPersonByEmpId = groupBy(this.state.staffData,'emp_id')
        const mapEmpId = map(this.state.staffData ,'emp_id')
        const salaryData =[]
        if(!isEmpty(groupByPersonByEmpId)){
            for(let person of mapEmpId){
                const specificStaff= groupByPersonByEmpId[person]
                const calculateSalary = await this.salaryLogic('2020-01-22','2020-02-22', specificStaff)
                let bonus = 0
                if(get(specificStaff[0],'gender') === 'Female'){
                    totalFemaleSalary += calculateSalary.salary
                    bonus = Math.abs(Math.floor(calculateSalary.salary/100)*10)
                }else {
                    totalMaleSalary += calculateSalary.salary
                }
                salaryData.push({
                    name: get(specificStaff[0],'name',''),
                    basic_salary : calculateSalary.salary,
                    overtime: calculateSalary.overtime,
                    bonus: bonus,
                    totalSalary: parseInt(calculateSalary.salary) + parseInt(calculateSalary.overtime) + parseInt(bonus),

                })
                if(get(specificStaff[0],'gender') === 'Female'){
                    totalFemaleSalary += calculateSalary.salary
                }else {
                    totalMaleSalary += calculateSalary.salary
                }

            }
        }
        this.setState({
            totalMaleSalary,totalFemaleSalary,
            salary : salaryData
        })
    }

    salaryLogic=async (fromDate,toDate,staffAttendance)=>{
        let salary = 0
        let overtime = 0

        for(let staff of staffAttendance ){
            const Designnation = get(staff ,'designation','')
            const weekday = get(staff,'weekday')
            const perDaySalary = get(staff,'per_day_salary',0)
            const totalWorkingHour =get(staff,'total_hours',0).toFixed(1)
            let dayStatus
            if(totalWorkingHour > 8){
                dayStatus = 'Full day'
            }else if(totalWorkingHour > 4){
                dayStatus = 'Half day'
            }else {
                dayStatus = 'Absent'
            }
            if(Designnation === 'Worker'){
                if(weekday !== 1 || weekday !==7){
                    if(dayStatus === 'Full day'){
                        salary += perDaySalary
                    }else if(dayStatus === 'Half day'){
                        salary += perDaySalary/2
                    }
                }else {
                    if(dayStatus === 'Full day'){
                        overtime += perDaySalary
                    }else if(dayStatus === 'Half day'){
                        overtime += perDaySalary/2
                    }
                }
            }else {
                if (weekday === 1 || weekday === 7) {
                    salary += perDaySalary
                } else if (totalWorkingHour > 8) {
                    salary += perDaySalary
                } else if (totalWorkingHour > 4) {
                    salary += perDaySalary / 2
                }
            }
        }
        return {salary,overtime}

    }

    render() {
        return(
            <div>
                <button onClick={()=> this.calculateSalary()}>Calculate Salary</button>
                <thead>
                <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Basic Salary</th>
                    <th scope="col">Overtime</th>
                    <th scope="col">Bonus</th>
                    <th scope="col">Total Salary</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.salary ?
                        this.state.salary.map((data,index)=>{
                            return <tr key ={index}>
                                <td>{index}</td>
                                <td>{data.name}</td>
                                <td>{data.basic_salary}</td>
                                <td>{data.overtime}</td>
                                <td>{data.bonus}</td>
                                <td>{data.totalSalary}</td>
                            </tr>
                        })
                        :"NO data found"
                }
                </tbody>
            </div>
        )
    }
}

export default CalculateSalary
