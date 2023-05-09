Cypress.on('uncaught:exception', () => {
  return false
})

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'Abramovich',
      name: 'Roman',
      password: 'pass'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('log in application')
  })


  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[name="Username"]').type('Abramovich')
      cy.get('input[name="Password"]').type('pass')
      cy.contains('login').click()
      cy.contains('Abramovich is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[name="Username"]').type('Lolito')
      cy.get('input[name="Password"]').type('password')
      cy.contains('login').click()
      cy.contains('Wrong credentials')
    })
  })


  describe('When a user is logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'Abramovich', name: 'Roman', password: 'pass'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[name="Title"]').type('Juventus-Sporting')
      cy.get('input[name="Author"]').type('Allegri')
      cy.get('input[name="Url"]').type('allegri.it')
      cy.get('input[name="Likes"]').type(1)
      cy.get('#createButton').click()
      cy.contains('Juventus-Sporting')
    })

    describe('When a blog is created', function() {
      beforeEach(function() {
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: {
            title: 'Average day of my life',
            author: 'Cromwel',
            url: 'best.com',
            likes: 5
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })
        cy.visit('http://localhost:3000')
        cy.contains('view').click()
      })

      it('users can like blogs', function() {
        cy.get('#likeButton').click()
        cy.contains('6 likes')
      })

      it('users can delete blogs they created', function() {
        cy.get('#removeButton').click()
        cy.contains('\'Average day of my life\' has been removed')
      })

      it('only creator can see remove button', function() {
        cy.contains('logout').click()
        const user = {
          username: 'Florentino',
          name: 'Papa Flo',
          password: 'hala'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'Florentino', name: 'Papa Flo', password: 'hala'
        }).then(response => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        })
        cy.visit('http://localhost:3000')
        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      it('blogs are ordered according to likes', function() {
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: {
            title: 'Best day of my life',
            author: 'Cromwel',
            url: 'best.com',
            likes: 10
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })
        cy.request({
          url: 'http://localhost:3003/api/blogs',
          method: 'POST',
          body: {
            title: 'Worst day of my life',
            author: 'Cromwel',
            url: 'best.com',
            likes: 1
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })
        cy.visit('http://localhost:3000')
        cy.get('[name=blogRecord]').eq(0).should('contain', 'Best day of my life - Cromwel')
        cy.get('[name=blogRecord]').eq(1).should('contain', 'Average day of my life - Cromwel')
        cy.get('[name=blogRecord]').eq(2).should('contain', 'Worst day of my life - Cromwel')
      })
    })
  })
})
