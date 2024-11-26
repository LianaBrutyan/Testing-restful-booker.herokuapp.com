import {faker} from '@faker-js/faker'

describe('Create Token, Booking requests and Get gooking by bookingID', () => {
    it('Verify login and booking functionality', () => {
        let token
        let bookingid
        const loginCreds = {
            "username": "admin",
            "password": "password123",
        }
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()

        const userInfo = {
            "firstname": firstName,
            "lastname": lastName,
            "totalprice": 543,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds" : "Breakfast"
        }
        cy.request({
            method: 'POST',
            url: `https://restful-booker.herokuapp.com/auth`,
            body: loginCreds
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('token')
            token = response.body.token
            cy.log(token)
        }).then(() => {
            cy.request({
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`
                },
                url: `https://restful-booker.herokuapp.com/booking`,
                body: userInfo
            })
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.booking).to.have.property('firstname', firstName)
            expect(response.body.booking).to.have.property('lastname', lastName)
            bookingid = response.body.bookingid
            cy.log(bookingid)
        }).then(() => {
        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingid}`,
        })
        }).then((response)=> {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('firstname',firstName)
            expect(response.body).to.have.property('lastname',lastName)
            expect(response.body).to.have.property('additionalneeds',"Breakfast");
            })
        })

    })

